import { api } from "./api";
import type {
    ArchivoDisenio, ClienteCompleto, ClienteRequest, Material, PedidoCompleto, PedidoCreado, PedidoRequest, TipoProducto,
} from "../types/captura";

export const capturaService = {
    tiposProducto: async () => {
        const { data } = await api.get<TipoProducto[]>("/tipo-producto");
        return Array.isArray(data) ? data : [];
    },

    materiales: async () => {
        const { data } = await api.get<Material[]>("/material");
        return Array.isArray(data) ? data : [];
    },

    crearCliente: async (cliente: ClienteRequest) => {
        const { data } = await api.post<{ id: string }>("/cliente", cliente);
        return data;
    },

    crearPedido: async (pedido: PedidoRequest) => {
        const { data } = await api.post<PedidoCreado>("/pedidos", pedido);
        return data;
    },

    archivosDisenio: async () => {
        const { data } = await api.get<ArchivoDisenio[]>("/archivo_disenio");
        return Array.isArray(data) ? data : [];
    },

    listarPedidos: async () => {
        const { data } = await api.get<{ id: string }[]>("/pedidos");
        return Array.isArray(data) ? data : [];
    },

    obtenerPedido: async (id: string) => {
        const { data } = await api.get<PedidoCompleto>(`/pedidos/${id}`);
        return data;
    },

    obtenerCliente: async (id: string) => {
        const { data } = await api.get<ClienteCompleto>(`/cliente/${id}`);
        return data;
    },

    actualizarCliente: async (id: string, cliente: ClienteRequest) => {
        await api.put(`/cliente/${id}`, cliente);
    },

    actualizarPedido: async (id: string, pedido: PedidoRequest) => {
        const { data } = await api.put<PedidoCreado>(`/pedidos/${id}`, pedido);
        return data;
    },
};