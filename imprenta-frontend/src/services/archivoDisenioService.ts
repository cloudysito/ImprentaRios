import { api } from "./api";
import type {
  ArchivoDisenio,
  ArchivoDisenioRequest,
} from "../types/archivoDisenio";

export const archivoDisenioService = {
  listar: async () => {
    const { data } = await api.get<ArchivoDisenio[]>("/archivo_disenio");
    return Array.isArray(data) ? data : [];
  },

  obtener: async (id: string) => {
    const { data } = await api.get<ArchivoDisenio>(`/archivo_disenio/${id}`);
    return data;
  },

  crear: async (archivo: ArchivoDisenioRequest) => {
    const { data } = await api.post<ArchivoDisenio>(
      "/archivo_disenio",
      archivo,
    );
    return data;
  },

  actualizar: async (id: string, archivo: ArchivoDisenioRequest) => {
    const { data } = await api.put<ArchivoDisenio>(
      `/archivo_disenio/${id}`,
      archivo,
    );
    return data;
  },

  eliminar: async (id: string) => {
    await api.delete(`/archivo_disenio/${id}`);
  },
};

// Se mantiene para la pantalla de registro, que solo crea la primera versión.
export const registrarArchivoDisenio = archivoDisenioService.crear;
