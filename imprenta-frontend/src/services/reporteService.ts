import { api } from "./api";
import type { ReporteMerma } from "../types/reporte";

export const reporteService = {
  // Sin fechas, el backend regresa el mes actual
  merma: async (desde?: string, hasta?: string) => {
    const { data } = await api.get<ReporteMerma>("/reportes/merma", { params: { desde, hasta } });
    return data;
  },
};
