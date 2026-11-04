// Tipos de las pantallas de consulta (ConsultarCalendario y ConsultarCronograma)

// ---------- Calendario ----------
export type TipoEvento = "PRODUCCION" | "ENTREGA" | "MANTENIMIENTO";

export interface EventoCalendario {
    id: string;
    tipo: TipoEvento;
    titulo: string; // "Impresión", "Entrega", "Mantenimiento"
    referencia: string; // folio corto o nombre de la máquina
    inicio: Date;
    fin: Date;
}

export interface ColumnaDia {
    dia: Date;
    esHoy: boolean;
    eventos: EventoCalendario[];
}

export interface TareaHoy {
    id: string;
    titulo: string;
    detalle: string;
    tipo: TipoEvento;
}

export interface EntregaProxima {
    id: string;
    folio: string;
    cliente: string;
    fecha: string;
}

export type FiltrosCalendario = Record<TipoEvento, boolean>;
export type VistaCalendario = "DIA" | "SEMANA";

// ---------- Cronograma ----------
export type EstadoBarra =
    | "DISENO"
    | "PRODUCCION"
    | "TERMINADO"
    | "PARO"
    | "PENDIENTE"
    | "ESTIMADO";

export type FiltroEstadoBarra = "TODOS" | "DISENO" | "PRODUCCION" | "TERMINADO" | "PARO";
export type VistaCronograma = "DIEZ_DIAS" | "MES";

export interface FilaCronograma {
    id: string;
    pedidoId: string | null; // null en las filas de mantenimiento
    titulo: string; // folio o nombre de máquina
    subtitulo: string;
    estado: EstadoBarra;
    etiqueta: string;
    inicio: Date;
    fin: Date;
}

export interface ResumenDelPeriodo {
    pedidosActivos: number;
    enProduccion: number;
    enDiseno: number;
    entregasSemana: number;
    paros: number;
}
