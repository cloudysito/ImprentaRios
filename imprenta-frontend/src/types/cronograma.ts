import type { PedidoDetalle, PedidoResumen } from "./pedido";

export type EstadoCronograma = "SIN_GENERAR" | "GENERADO";
export type FiltroCronograma = "TODOS" | EstadoCronograma;

export const ESTADO_CRONOGRAMA_LABEL: Record<EstadoCronograma, string> = {
    SIN_GENERAR: "Sin generar",
    GENERADO: "Generado",
};

// Lo que devuelve GET /api/actividad
export interface Actividad {
    id: string;
    nombreActividad: string;
    descripcion: string | null;
    fechaHoraInicio: string; // "2026-09-22T08:00:00"
    fechaHoraFin: string;
    pedidoId: string;
    empleadoId: string;
}

// Lo que se manda en POST /api/actividad
export type ActividadRequest = Omit<Actividad, "id">;

// Un pedido mas el estado de su cronograma
export interface CronogramaResumen extends PedidoResumen {
    estadoCronograma: EstadoCronograma;
}

export interface CronogramaDetalle extends PedidoDetalle {
    estadoCronograma: EstadoCronograma;
    actividades: Actividad[];
}