export interface TipoProducto {
    id: string;
    nombre: string;
    descripcion?: string;
}

export interface Material {
    id: string;
    nombre: string;
    gramaje: number;
    insumoId: string;
}

export const TINTAS = ["CMYK", "PANTONE", "UNA_TINTA"] as const;
export const ACABADOS = [
    "NINGUNO", "BARNIZ", "LAMINADO", "SUAJADO", "DOBLEZ", "ENGRAPADO", "ENCUADERNADO",
] as const;
export const PRIORIDADES = ["BAJA", "MEDIA", "ALTA"] as const;

export interface ProductoForm {
    tipoProductoId: string;
    cantidad: string;
    materialId: string;
    medidas: string;
    tinta: string;
    tipoAcabado: string;
    prioridad: string;
    observaciones: string;
}

export const productoVacio = (): ProductoForm => ({
    tipoProductoId: "",
    cantidad: "",
    materialId: "",
    medidas: "",
    tinta: "CMYK",
    tipoAcabado: "NINGUNO",
    prioridad: "MEDIA",
    observaciones: "",
});

export interface ClienteRequest {
    nombre: string;
    telefono: string;
    correo: string;
}

export interface PedidoRequest {
    nombreProyecto: string;
    fechaEntrega: string;
    clienteId: string;
    productos: (Omit<ProductoForm, "cantidad"> & { cantidad: number })[];
    personaSolicita?: string | null;
    precioAcordado?: number | null;
    archivoDisenioId?: string | null;
}

export interface PedidoCreado {
    id: string;
    folio: string;
}

export interface ArchivoDisenio {
    id: string;
    nombreArchivo: string;
    version: number | null;
}

export interface ClienteCompleto extends ClienteRequest {
    id: string;
}

export interface PedidoCompleto {
    id: string;
    folio: string;
    estado: string;
    nombreProyecto: string;
    fechaEntrega: string;
    clienteId: string;
    personaSolicita: string | null;
    precioAcordado: number | null;
    archivoDisenioId: string | null;
    productos: (Omit<ProductoForm, "cantidad" | "observaciones"> & {
        cantidad: number;
        observaciones: string | null;
    })[];
}