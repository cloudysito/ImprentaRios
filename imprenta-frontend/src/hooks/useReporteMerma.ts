import { useEffect, useState } from "react";
import { reporteService } from "../services/reporteService";
import { mensajeDeError } from "../utils/errores";
import type { ReporteMerma } from "../types/reporte";

export function useReporteMerma() {
  const [reporte, setReporte] = useState<ReporteMerma | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    reporteService
      .merma()
      .then((datos) => {
        if (!cancelado) setReporte(datos);
      })
      .catch((err) => {
        if (!cancelado) setError(mensajeDeError(err, "No se pudo cargar el reporte de merma"));
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  return { reporte, cargando, error };
}
