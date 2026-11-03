export type TipoInsumo = "SUSTRATO" | "TINTA" | "QUIMICO";
export type EstatusStock = "SUFICIENTE" | "POR_AGOTARSE" | "DESABASTO";
export type TipoMovimiento = "ENTRADA" | "SALIDA";

export interface Insumo {
  id: string;
  nombre: string;
  tipoInsumo: TipoInsumo;
  unidad: string;
  cantidadDisponible: number;
  puntoReorden: number;
  ultimaEntrada: string | null; // "2026-09-12"
  estatus: EstatusStock;
}

export interface InsumoRequest {
  nombre: string;
  tipoInsumo: TipoInsumo;
  unidad: string;
  cantidadDisponible: number;
  puntoReorden: number;
}

export interface MovimientoRequest {
  tipo: TipoMovimiento;
  cantidad: number;
  fecha: string;
  motivo: string;
}

export interface Movimiento extends MovimientoRequest {
  id: string;
  insumoId: string;
  insumoNombre: string;
}

export const ESTATUS_STOCK_LABEL: Record<EstatusStock, string> = {
  SUFICIENTE: "Suficiente",
  POR_AGOTARSE: "Por agotarse",
  DESABASTO: "Desabasto",
};

export const ESTATUS_STOCK_CLASE: Record<EstatusStock, string> = {
  SUFICIENTE: "ok",
  POR_AGOTARSE: "aviso",
  DESABASTO: "peligro",
};

export const TIPO_INSUMO_LABEL: Record<TipoInsumo, string> = {
  SUSTRATO: "Sustrato (papel, cartulina, placas)",
  TINTA: "Tinta",
  QUIMICO: "Químico",
};

export const MOTIVOS_MOVIMIENTO: Record<TipoMovimiento, string[]> = {
  ENTRADA: ["Compra a proveedor", "Devolución de producción", "Ajuste de inventario"],
  SALIDA: ["Consumo en producción", "Merma", "Ajuste de inventario"],
};
