import type { EstadoPedido } from "./pedido";

export type TipoTinta = "CMYK" | "PANTONE" | "UNA_TINTA";
export type TipoAcabado =
  | "NINGUNO"
  | "BARNIZ"
  | "LAMINADO"
  | "SUAJADO"
  | "DOBLEZ"
  | "ENGRAPADO"
  | "ENCUADERNADO";
export type Prioridad = "BAJA" | "MEDIA" | "ALTA";

export interface TipoProducto {
  id: string;
  nombre: string;
  descripcion: string | null;
}

export interface Material {
  id: string;
  nombre: string;
  gramaje: number;
  insumoId: string | null;
}

export interface ArchivoDisenio {
  id: string;
  nombreArchivo: string;
  version: number | null;
}

export interface ClienteRequest {
  nombre: string;
  telefono: string;
  correo: string | null;
}

export interface Cliente extends ClienteRequest {
  id: string;
}

export interface ProductoRequest {
  cantidad: number;
  medidas: string;
  tinta: TipoTinta;
  tipoAcabado: TipoAcabado;
  prioridad: Prioridad;
  observaciones: string | null;
  tipoProductoId: string;
  materialId: string;
}

export interface PedidoRequest {
  fechaEntrega: string;
  nombreProyecto: string;
  productos: ProductoRequest[];
  clienteId: string;
  personaSolicita: string | null;
  precioAcordado: number | null;
  archivoDisenioId: string | null;
}

export interface PedidoCreado {
  id: string;
  folio: string;
  fechaRegistro: string;
  fechaEntrega: string;
  estado: EstadoPedido;
}

// Todo se guarda como texto porque así lo manejan los inputs
export interface FormularioPedido {
  nombreCliente: string;
  telefono: string;
  correo: string;
  personaSolicita: string;
  nombreProyecto: string;
  fechaEntrega: string;
  prioridad: Prioridad;
  tipoProductoId: string;
  cantidad: string;
  materialId: string;
  medidas: string;
  tinta: TipoTinta | "";
  tipoAcabado: TipoAcabado;
  observaciones: string;
  archivoDisenioId: string;
  precioAcordado: string;
}

export type CampoPedido = keyof FormularioPedido;
export type ErroresPedido = Partial<Record<CampoPedido, string>>;

export const TINTAS: { valor: TipoTinta; texto: string }[] = [
  { valor: "CMYK", texto: "Full color (CMYK)" },
  { valor: "PANTONE", texto: "Pantone" },
  { valor: "UNA_TINTA", texto: "Una tinta" },
];

export const ACABADOS: { valor: TipoAcabado; texto: string }[] = [
  { valor: "NINGUNO", texto: "Sin acabado" },
  { valor: "BARNIZ", texto: "Barniz" },
  { valor: "LAMINADO", texto: "Laminado" },
  { valor: "SUAJADO", texto: "Suajado" },
  { valor: "DOBLEZ", texto: "Doblez" },
  { valor: "ENGRAPADO", texto: "Engrapado" },
  { valor: "ENCUADERNADO", texto: "Encuadernado" },
];

export const PRIORIDADES: { valor: Prioridad; texto: string }[] = [
  { valor: "BAJA", texto: "Baja" },
  { valor: "MEDIA", texto: "Media" },
  { valor: "ALTA", texto: "Alta" },
];
