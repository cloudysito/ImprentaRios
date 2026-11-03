import type { EstadoPedido } from "./pedido";

export interface Asignacion {
  actividadId: string;
  nombreActividad: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  pedidoId: string;
  folio: string;
  clienteNombre: string;
  producto: string;
  piezas: number;
  fechaEntrega: string;
  estadoPedido: EstadoPedido;
  piezasTerminadas: number;
  merma: number;
  motivoMerma: string | null;
  observaciones: string | null;
  ultimoReporte: string | null;
  terminada: boolean;
}

export interface ReporteAvance {
  piezasTerminadas: number;
  merma: number;
  motivoMerma: string | null;
  observaciones: string | null;
}

export const MOTIVOS_MERMA = [
  "Ajuste de registro",
  "Papel dañado o arrugado",
  "Falla de máquina",
  "Error de impresión",
  "Corte o acabado defectuoso",
  "Otro",
];
