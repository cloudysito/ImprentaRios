export interface MermaPorMotivo {
  motivo: string;
  merma: number;
  porcentajeDelTotal: number;
}

export interface MermaPorPedido {
  pedidoId: string;
  folio: string;
  proyecto: string;
  piezasTerminadas: number;
  merma: number;
  porcentajeMerma: number;
}

// Merma del taller en un periodo. porcentajeMerma = merma / (piezas terminadas + merma)
export interface ReporteMerma {
  desde: string;
  hasta: string;
  totalMerma: number;
  totalPiezasTerminadas: number;
  porcentajeMerma: number;
  porMotivo: MermaPorMotivo[];
  porPedido: MermaPorPedido[];
}
