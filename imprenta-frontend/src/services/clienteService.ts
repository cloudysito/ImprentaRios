import { api } from "./api";
import type { Cliente } from "../types/captura";

export const clienteService = {
  listar: async (busqueda = "") => {
    const { data } = await api.get<Cliente[]>("/cliente", {
      params: busqueda.trim() ? { busqueda: busqueda.trim() } : undefined,
    });
    return Array.isArray(data) ? data : [];
  },
};
