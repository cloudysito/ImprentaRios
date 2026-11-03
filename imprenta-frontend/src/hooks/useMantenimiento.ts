import { useEffect, useState } from "react";
import { mantenimientoService } from "../services/mantenimientoService";
import { mensajeDeError } from "../utils/errores";
import type {
  MaquinaDetalle,
  MaquinaRequest,
  MaquinaResumen,
  ServicioRequest,
} from "../types/mantenimiento";

// Guardamos a qué máquina pertenece cada detalle para saber si sigue vigente
interface Resultado {
  id: string;
  detalle: MaquinaDetalle | null;
  error: string | null;
}

const aResumen = (d: MaquinaDetalle): MaquinaResumen => ({
  id: d.id,
  nombre: d.nombre,
  descripcion: d.descripcion,
  proximoServicio: d.proximoServicio,
  servicioProgramado: d.servicioProgramado,
  estatus: d.estatus,
});

export function useMantenimiento() {
  const [maquinas, setMaquinas] = useState<MaquinaResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idElegido, setIdElegido] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    let cancelado = false;
    mantenimientoService
      .listar()
      .then((data) => {
        if (!cancelado) setMaquinas(data);
      })
      .catch((err) => {
        if (!cancelado) setError(mensajeDeError(err, "No se pudo cargar la maquinaria"));
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  const seleccionadoId = idElegido ?? maquinas[0]?.id ?? null;

  useEffect(() => {
    if (!seleccionadoId) return;
    let cancelado = false;
    mantenimientoService
      .obtener(seleccionadoId)
      .then((data) => {
        if (!cancelado) setResultado({ id: seleccionadoId, detalle: data, error: null });
      })
      .catch((err) => {
        if (!cancelado) {
          setResultado({
            id: seleccionadoId,
            detalle: null,
            error: mensajeDeError(err, "No se pudo cargar la máquina"),
          });
        }
      });
    return () => {
      cancelado = true;
    };
  }, [seleccionadoId]);

  const vigente = resultado && resultado.id === seleccionadoId ? resultado : null;

  const aplicar = (detalle: MaquinaDetalle) => {
    setResultado({ id: detalle.id, detalle, error: null });
    setMaquinas((prev) =>
      prev.some((m) => m.id === detalle.id)
        ? prev.map((m) => (m.id === detalle.id ? aResumen(detalle) : m))
        : [...prev, aResumen(detalle)].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    );
  };

  const crearMaquina = async (dto: MaquinaRequest) => {
    const nueva = await mantenimientoService.crear(dto);
    aplicar(nueva);
    setIdElegido(nueva.id);
    return nueva;
  };

  const registrarServicio = async (dto: ServicioRequest) => {
    if (!seleccionadoId) return null;
    const actualizada = await mantenimientoService.registrarServicio(seleccionadoId, dto);
    aplicar(actualizada);
    return actualizada;
  };

  const programarAlerta = async (fechaHora: string) => {
    if (!seleccionadoId) return null;
    const actualizada = await mantenimientoService.programarAlerta(seleccionadoId, fechaHora);
    aplicar(actualizada);
    return actualizada;
  };

  return {
    maquinas,
    cargando,
    error,
    seleccionadoId,
    seleccionar: setIdElegido,
    detalle: vigente?.detalle ?? null,
    cargandoDetalle: seleccionadoId !== null && vigente === null,
    errorDetalle: vigente?.error ?? null,
    crearMaquina,
    registrarServicio,
    programarAlerta,
  };
}
