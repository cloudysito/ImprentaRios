export type TipoServicio = "PREVENTIVO" | "CORRECTIVO";
export type EstatusMaquina = "EN_REGLA" | "PROGRAMADO" | "ATRASADO";

export interface MaquinaResumen {
  id: string;
  nombre: string;
  descripcion: string | null;
  proximoServicio: string | null;
  servicioProgramado: boolean;
  estatus: EstatusMaquina;
}

export interface Servicio {
  id: string;
  tipo: TipoServicio;
  fecha: string;
  tecnico: string;
  paroEstimadoHoras: number | null;
  refacciones: string | null;
  notas: string | null;
}

export interface MaquinaDetalle extends MaquinaResumen {
  numeroSerie: string | null;
  anioOperacion: number | null;
  responsable: string | null;
  periodicidadDias: number;
  horasUso: number;
  ultimoServicio: string | null;
  serviciosEnAnio: number;
  historial: Servicio[];
}

export interface MaquinaRequest {
  nombre: string;
  descripcion: string;
  numeroSerie: string;
  anioOperacion: number | null;
  responsable: string;
  periodicidadDias: number;
  horasUso: number;
}

export interface ServicioRequest {
  tipo: TipoServicio;
  fecha: string;
  tecnico: string;
  paroEstimadoHoras: number | null;
  refacciones: string;
  notas: string;
}

export const TIPO_SERVICIO_LABEL: Record<TipoServicio, string> = {
  PREVENTIVO: "Preventivo",
  CORRECTIVO: "Correctivo",
};

export const ESTATUS_MAQUINA_LABEL: Record<EstatusMaquina, string> = {
  EN_REGLA: "En regla",
  PROGRAMADO: "Programado",
  ATRASADO: "Atrasado",
};

export const ESTATUS_MAQUINA_CLASE: Record<EstatusMaquina, string> = {
  EN_REGLA: "ok",
  PROGRAMADO: "aviso",
  ATRASADO: "peligro",
};
