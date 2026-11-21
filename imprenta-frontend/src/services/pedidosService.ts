import { api } from "./api";
import type { EstadoPedido, PedidoDetalle, PedidoResumen } from "../types/pedido";

export const pedidosService = {
  listar: async () => {
    const { data } = await api.get<PedidoResumen[]>("/pedidos");
    return Array.isArray(data) ? data : [];
  },

  obtener: async (id: string) => {
    const { data } = await api.get<PedidoDetalle>(`/pedidos/${id}/detalle`);
    return data;
  },

  cambiarEstado: async (id: string, estado: EstadoPedido) => {
    const { data } = await api.patch<PedidoDetalle>(`/pedidos/${id}/estado`, { estado });
    return data;
  },

  eliminar: async (id: string) => {
    await api.delete(`/pedidos/${id}`);
  },
};
