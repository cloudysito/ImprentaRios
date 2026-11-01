export type EstadoPedido =
  | "REGISTRADO"
  | "PENDIENTE_DE_MATERIAL"
  | "EN_DISENIO"
  | "EN_PRODUCCION"
  | "TERMINADO"
  | "ENTREGADO"
  | "CANCELADO";

export interface PedidoResumen {
  id: string;
  folio: string;
  clienteNombre: string;
  producto: string;
  piezas: number;
  fechaEntrega: string; // ISO, ej. "2026-09-22T00:00:00"
  estado: EstadoPedido;
}

export interface EventoBitacora {
  fecha: string;
  descripcion: string;
}


export interface PedidoDetalle extends PedidoResumen {
  piezasTerminadas: number;
  versionDisenio: string | null; 
  bitacora: EventoBitacora[];
}

export type FiltroEstado = "TODOS" | EstadoPedido;

export const ESTADO_LABEL: Record<EstadoPedido, string> = {
  REGISTRADO: "Registrado",
  PENDIENTE_DE_MATERIAL: "Sin material",
  EN_DISENIO: "En diseño",
  EN_PRODUCCION: "En producción",
  TERMINADO: "Terminado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};
