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
  vencido: boolean; // la entrega ya pasó y el pedido no está terminado, entregado ni cancelado
  diasAtraso: number;
}

export interface EventoBitacora {
  fecha: string;
  descripcion: string;
  usuario: string;
}


export interface PedidoDetalle extends PedidoResumen {
  piezasTerminadas: number;
  materialDescontado: boolean; // el material del pedido ya se descontó del inventario
  versionDisenio: string | null;
  asignadoA: string | null;
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
