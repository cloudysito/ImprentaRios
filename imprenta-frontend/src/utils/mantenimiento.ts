import type { MaquinaResumen } from "../types/mantenimiento";
import { diaMes, esHoy, hora } from "./fechas";

export const textoProximoServicio = (m: MaquinaResumen) => {
  if (!m.proximoServicio) return "Sin servicios registrados";
  if (m.estatus === "ATRASADO") return `Vencido desde el ${diaMes(m.proximoServicio)}`;
  if (m.servicioProgramado) {
    return esHoy(m.proximoServicio)
      ? `Servicio hoy ${hora(m.proximoServicio)} h`
      : `Servicio ${diaMes(m.proximoServicio)} ${hora(m.proximoServicio)} h`;
  }
  return `Próximo servicio ${diaMes(m.proximoServicio)}`;
};
