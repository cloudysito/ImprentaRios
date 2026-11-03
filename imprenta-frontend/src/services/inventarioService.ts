import { api } from "./api";
import type { Insumo, InsumoRequest, Movimiento, MovimientoRequest } from "../types/inventario";

export const inventarioService = {
  listarInsumos: async () => {
    const { data } = await api.get<Insumo[]>("/insumo");
    return data;
  },

  crearInsumo: async (dto: InsumoRequest) => {
    const { data } = await api.post<Insumo>("/insumo", dto);
    return data;
  },

  actualizarInsumo: async (id: string, dto: InsumoRequest) => {
    const { data } = await api.put<Insumo>(`/insumo/${id}`, dto);
    return data;
  },

  registrarMovimiento: async (id: string, dto: MovimientoRequest) => {
    const { data } = await api.post<Insumo>(`/insumo/${id}/movimientos`, dto);
    return data;
  },

  // Sin fechas, el backend regresa los del mes actual
  listarMovimientosDelMes: async () => {
    const { data } = await api.get<Movimiento[]>("/insumo/movimientos");
    return data;
  },
};
