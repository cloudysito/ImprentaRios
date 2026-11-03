import type { Asignacion } from "../types/taller";

export const porcentajeAvance = (a: Asignacion) =>
  a.piezas > 0 ? Math.min(100, Math.round((a.piezasTerminadas / a.piezas) * 100)) : 0;
