import { api } from "./api";
import type { Insumo } from "../types/inventario";
import type {
  ArchivoDisenio,
  Cliente,
  ClienteRequest,
  Material,
  PedidoCreado,
  PedidoRequest,
  TipoProducto,
} from "../types/capturaPedido";

export const capturaPedidoService = {
  listarTiposProducto: async () => {
    const { data } = await api.get<TipoProducto[]>("/tipo-producto");
    return data;
  },

  listarMateriales: async () => {
    const { data } = await api.get<Material[]>("/material");
    return data;
  },

  listarArchivosDisenio: async () => {
    const { data } = await api.get<ArchivoDisenio[]>("/archivo_disenio");
    return data;
  },

  obtenerInsumo: async (id: string) => {
    const { data } = await api.get<Insumo>(`/insumo/${id}`);
    return data;
  },

  crearCliente: async (dto: ClienteRequest) => {
    const { data } = await api.post<Cliente>("/cliente", dto);
    return data;
  },

  crearPedido: async (dto: PedidoRequest) => {
    const { data } = await api.post<PedidoCreado>("/pedidos", dto);
    return data;
  },
};
