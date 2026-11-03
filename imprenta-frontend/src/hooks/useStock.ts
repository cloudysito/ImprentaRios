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
        setInsumos(lista);
        setMovimientosMes(movimientos.length);
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
    () => [...insumos].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    [insumos],
  );

  const conAlerta = useMemo(() => ordenados.filter((i) => i.estatus !== "SUFICIENTE"), [ordenados]);

  const reemplazar = (actualizado: Insumo) =>
    setInsumos((prev) => prev.map((i) => (i.id === actualizado.id ? actualizado : i)));

  const registrarMovimiento = async (insumoId: string, dto: MovimientoRequest) => {
    const actualizado = await inventarioService.registrarMovimiento(insumoId, dto);
    reemplazar(actualizado);
    if (dto.fecha.slice(0, 7) === hoyISO().slice(0, 7)) {
      setMovimientosMes((n) => n + 1);
    }
    return actualizado;
  };

  const crearInsumo = async (dto: InsumoRequest) => {
    const nuevo = await inventarioService.crearInsumo(dto);
    setInsumos((prev) => [...prev, nuevo]);
    return nuevo;
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
    guardarPuntos,
  };
}
