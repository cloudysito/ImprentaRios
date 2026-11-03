import { api } from "./api";

export interface ArchivoDisenioRequest {
  nombreArchivo: string;
  fechaRecepcion: string;
  fechaEntrega: string;
  resolucion: number;
  modoColor: string;
  sangrado: number;
  medidaArchivo: string;
  caras: number;
  prensa: string;
  version: number;
}

export interface ArchivoDisenioResponse extends ArchivoDisenioRequest {
  id: string;
}

export const registrarArchivoDisenio = async (
  archivo: ArchivoDisenioRequest,
): Promise<ArchivoDisenioResponse> => {
  const { data } = await api.post<ArchivoDisenioResponse>(
    "/archivo_disenio",
    archivo,
  );
  return data;
};
