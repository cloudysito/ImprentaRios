import { api } from "./api";
import type {
    ClienteRequest, Material, PedidoCreado, PedidoRequest, TipoProducto,
} from "../types/captura";

export const capturaService = {
    tiposProducto: async () => {
        const { data } = await api.get<TipoProducto[]>("/tipo-producto");
        return data;
    },

    materiales: async () => {
        const { data } = await api.get<Material[]>("/material");
        return data;
    },

    crearCliente: async (cliente: ClienteRequest) => {
        const { data } = await api.post<{ id: string }>("/cliente", cliente);
        return data;
    },

    crearPedido: async (pedido: PedidoRequest) => {
        const { data } = await api.post<PedidoCreado>("/pedidos", pedido);
        return data;
    },
};