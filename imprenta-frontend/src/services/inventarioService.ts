import { api } from "./api";
import type {
  Insumo,
  InsumoRequest,
  Material,
  MaterialRequest,
  Movimiento,
  MovimientoRequest,
} from "../types/inventario";

export const inventarioService = {
  listarInsumos: async () => {
    const { data } = await api.get<Insumo[]>("/insumo");
    return Array.isArray(data) ? data : [];
  },

  crearInsumo: async (dto: InsumoRequest) => {
    const { data } = await api.post<Insumo>("/insumo", dto);
    return data;
  },

  crearMaterial: async (dto: MaterialRequest) => {
    const { data } = await api.post<Material>("/material", dto);
    return data;
  },

  listarMateriales: async () => {
    const { data } = await api.get<Material[]>("/material");
    return Array.isArray(data) ? data : [];
  },

  actualizarMaterial: async (id: string, dto: MaterialRequest) => {
    const { data } = await api.put<Material>(`/material/${id}`, dto);
    return data;
  },

  eliminarMaterial: async (id: string) => {
    await api.delete(`/material/${id}`);
  },

  actualizarInsumo: async (id: string, dto: InsumoRequest) => {
    const { data } = await api.put<Insumo>(`/insumo/${id}`, dto);
    return data;
  },

  eliminarInsumo: async (id: string) => {
    await api.delete(`/insumo/${id}`);
  },

  registrarMovimiento: async (id: string, dto: MovimientoRequest) => {
    const { data } = await api.post<Insumo>(`/insumo/${id}/movimientos`, dto);
    return data;
  },

  // Sin fechas, el backend regresa los del mes actual
  listarMovimientosDelMes: async () => {
    const { data } = await api.get<Movimiento[]>("/insumo/movimientos");
    return Array.isArray(data) ? data : [];
  },

  listarMovimientos: async (desde: string, hasta: string) => {
    const { data } = await api.get<Movimiento[]>("/insumo/movimientos", {
      params: { desde, hasta },
    });
    return Array.isArray(data) ? data : [];
  },
};
