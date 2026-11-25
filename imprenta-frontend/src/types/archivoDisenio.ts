export interface ArchivoDisenio {
  id: string;
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
  // Id de la primera versión del diseño; null cuando este registro es la raíz.
  grupoId: string | null;
}

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
  grupoId?: string | null;
}

// Un diseño agrupado con todas sus versiones, de la más nueva a la más vieja.
export interface GrupoArchivoDisenio {
  id: string;
  nombreArchivo: string;
  actual: ArchivoDisenio;
  versiones: ArchivoDisenio[];
}
