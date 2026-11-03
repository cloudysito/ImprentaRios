import { api } from "./api";
import type {
  MaquinaDetalle,
  MaquinaRequest,
  MaquinaResumen,
  ServicioRequest,
} from "../types/mantenimiento";

export const mantenimientoService = {
  listar: async () => {
    const { data } = await api.get<MaquinaResumen[]>("/maquinas");
    return data;
  },

  obtener: async (id: string) => {
    const { data } = await api.get<MaquinaDetalle>(`/maquinas/${id}`);
    return data;
  },

  crear: async (dto: MaquinaRequest) => {
    const { data } = await api.post<MaquinaDetalle>("/maquinas", dto);
    return data;
  },

  registrarServicio: async (id: string, dto: ServicioRequest) => {
    const { data } = await api.post<MaquinaDetalle>(`/maquinas/${id}/servicios`, dto);
    return data;
  },

  // fechaHora como "2026-10-02T14:00:00"
  programarAlerta: async (id: string, fechaHora: string) => {
    const { data } = await api.put<MaquinaDetalle>(`/maquinas/${id}/alerta`, { fechaHora });
    return data;
  },
};
