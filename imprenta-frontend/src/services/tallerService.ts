import { api } from "./api";
import type { Asignacion, ReporteAvance } from "../types/taller";

export const tallerService = {
  // Las del empleado que inició sesión (lo sabe el backend por el token)
  misAsignaciones: async () => {
    const { data } = await api.get<Asignacion[]>("/actividad/mis-asignaciones");
    return data;
  },

  reportarAvance: async (actividadId: string, dto: ReporteAvance) => {
    const { data } = await api.post<Asignacion>(`/actividad/${actividadId}/avance`, dto);
    return data;
  },

  terminar: async (actividadId: string) => {
    const { data } = await api.post<Asignacion>(`/actividad/${actividadId}/terminar`);
    return data;
  },
};
