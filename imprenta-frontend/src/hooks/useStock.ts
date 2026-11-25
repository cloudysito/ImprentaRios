import { useEffect, useMemo, useState } from "react";
import { inventarioService } from "../services/inventarioService";
import { pedidosService } from "../services/pedidosService";
import { hoyISO } from "../utils/fechas";
import { mensajeDeError } from "../utils/errores";
import type { Insumo, InsumoRequest, Movimiento, MovimientoRequest } from "../types/inventario";

export function useStock() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [movimientosMes, setMovimientosMes] = useState(0);
  const [folios, setFolios] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    Promise.all([
      inventarioService.listarInsumos(),
      inventarioService.listarMovimientosDelMes().catch((): Movimiento[] => []),
    ])
      .then(([lista, movimientos]) => {
        if (cancelado) return;
        setInsumos(Array.isArray(lista) ? lista : []);
        setMovimientosMes(Array.isArray(movimientos) ? movimientos.length : 0);
      })
      .catch((err) => {
        if (!cancelado) setError(mensajeDeError(err, "No se pudo cargar el inventario"));
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    // Folios activos, para poder ligar una salida a un pedido. Si falla no pasa nada
    pedidosService
      .listar()
      .then((pedidos) => {
        if (cancelado) return;
        setFolios(
          pedidos
            .filter((p) => p && typeof p.folio === "string")
            .filter((p) => p.estado !== "ENTREGADO" && p.estado !== "CANCELADO")
            .map((p) => p.folio),
        );
      })
      .catch(() => {});

    return () => {
      cancelado = true;
    };
  }, []);

  const ordenados = useMemo(
    () => (Array.isArray(insumos) ? [...insumos] : [])
      .filter((i) => i && typeof i.nombre === "string")
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    [insumos],
  );

  const conAlerta = useMemo(() => ordenados.filter((i) => i.estatus !== "SUFICIENTE"), [ordenados]);

  const reemplazar = (actualizado: Insumo) =>
      setInsumos((prev) => prev.map((i) => (i.id === actualizado.id ? actualizado : i)));

  // Los sustratos tienen un material ligado que se muestra al capturar pedidos.
  const materialDeInsumo = async (insumoId: string) => {
    const materiales = await inventarioService.listarMateriales();
    return materiales.find((m) => m.insumoId === insumoId) ?? null;
  };

  const registrarMovimiento = async (insumoId: string, dto: MovimientoRequest) => {
    const actualizado = await inventarioService.registrarMovimiento(insumoId, dto);
    reemplazar(actualizado);
    if (dto.fecha.slice(0, 7) === hoyISO().slice(0, 7)) {
      setMovimientosMes((n) => n + 1);
    }
    return actualizado;
  };

  const crearInsumo = async (dto: InsumoRequest, gramaje?: number) => {
    const nuevo = await inventarioService.crearInsumo(dto);

    // Los sustratos también son materiales seleccionables al capturar un pedido.
    if (dto.tipoInsumo === "SUSTRATO" && gramaje !== undefined) {
      try {
        await inventarioService.crearMaterial({
          nombre: dto.nombre,
          gramaje,
          insumoId: nuevo.id,
        });
      } catch (err) {
        // Si falla el material, no dejamos un insumo huérfano en el inventario.
        await inventarioService.eliminarInsumo(nuevo.id).catch(() => {});
        throw err;
      }
    }

    setInsumos((prev) => [...prev, nuevo]);
    return nuevo;
  };

  const actualizarInsumo = async (id: string, dto: InsumoRequest) => {
    const anterior = insumos.find((i) => i.id === id);
    const actualizado = await inventarioService.actualizarInsumo(id, dto);
    reemplazar(actualizado);

    // El material del pedido copia el nombre del insumo: si se renombra el
    // sustrato, el selector de pedidos debe mostrar el nombre nuevo.
    if (anterior?.tipoInsumo === "SUSTRATO" && anterior.nombre !== dto.nombre) {
      await materialDeInsumo(id)
        .then((material) =>
          material && material.nombre !== dto.nombre
            ? inventarioService.actualizarMaterial(material.id, {
                nombre: dto.nombre,
                gramaje: material.gramaje,
                insumoId: id,
              })
            : undefined,
        )
        .catch(() => {});
    }

    return actualizado;
  };

  const eliminarInsumo = async (id: string) => {
    const insumo = insumos.find((i) => i.id === id);

    // Los sustratos tienen un material ligado para los pedidos. Se retira
    // antes del insumo, pero sólo si no hay movimientos: así no queda un
    // material eliminado con su insumo todavía en inventario.
    if (insumo?.tipoInsumo === "SUSTRATO") {
      const movimientos = await inventarioService.listarMovimientos("1970-01-01", hoyISO());
      if (!movimientos.some((m) => m.insumoId === id)) {
        const material = await materialDeInsumo(id);
        if (material) await inventarioService.eliminarMaterial(material.id);
      }
    }

    await inventarioService.eliminarInsumo(id);
    setInsumos((prev) => prev.filter((i) => i.id !== id));
  };

  // cambios = { idInsumo: nuevoPuntoDeReorden }
  const guardarPuntos = async (cambios: Record<string, number>) => {
    const pendientes = insumos.filter((i) => cambios[i.id] !== undefined);
    const actualizados = await Promise.all(
        pendientes.map((i) =>
            inventarioService.actualizarInsumo(i.id, {
              nombre: i.nombre,
              tipoInsumo: i.tipoInsumo,
              unidad: i.unidad,
              cantidadDisponible: i.cantidadDisponible,
              puntoReorden: cambios[i.id],
            }),
        ),
    );
    actualizados.forEach(reemplazar);
  };

  return {
    insumos: ordenados,
    conAlerta,
    movimientosMes,
    folios,
    cargando,
    error,
    registrarMovimiento,
    crearInsumo,
    actualizarInsumo,
    eliminarInsumo,
    guardarPuntos,
  };
}