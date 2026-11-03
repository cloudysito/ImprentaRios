import { useEffect, useMemo, useState } from "react";
import { tallerService } from "../services/tallerService";
import { esHoy } from "../utils/fechas";
import { mensajeDeError } from "../utils/errores";
import type { Asignacion, ReporteAvance } from "../types/taller";

export function useTaller() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idElegido, setIdElegido] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    tallerService
      .misAsignaciones()
      .then((data) => {
        if (!cancelado) setAsignaciones(data);
      })
      .catch((err) => {
        if (!cancelado) setError(mensajeDeError(err, "No se pudieron cargar tus asignaciones"));
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  // Si nadie eligió una, se muestra la primera que no está terminada
  const seleccionada =
    asignaciones.find((a) => a.actividadId === idElegido) ??
    asignaciones.find((a) => !a.terminada) ??
    asignaciones[0] ??
    null;

  // La hora de inicio más temprana de lo que empieza hoy
  const inicioTurno = useMemo(() => {
    const deHoy = asignaciones
      .map((a) => a.fechaHoraInicio)
      .filter((inicio) => esHoy(inicio))
      .sort();
    return deHoy[0] ?? null;
  }, [asignaciones]);

  const reemplazar = (actualizada: Asignacion) =>
    setAsignaciones((prev) =>
      prev.map((a) => (a.actividadId === actualizada.actividadId ? actualizada : a)),
    );

  const reportar = async (actividadId: string, dto: ReporteAvance) => {
    const actualizada = await tallerService.reportarAvance(actividadId, dto);
    reemplazar(actualizada);
    return actualizada;
  };

  const terminar = async (actividadId: string) => {
    const actualizada = await tallerService.terminar(actividadId);
    setIdElegido(actividadId); // se queda en la tarjeta para que se vea la confirmación
    reemplazar(actualizada);
    return actualizada;
  };

  return {
    asignaciones,
    cargando,
    error,
    seleccionada,
    seleccionar: setIdElegido,
    inicioTurno,
    reportar,
    terminar,
  };
}
