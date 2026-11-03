import type { Asignacion } from "../../types/taller";
import { formatNumero } from "../../utils/formato";
import { aFecha, diaMes, esAyer, hora } from "../../utils/fechas";
import { porcentajeAvance } from "../../utils/taller";

const horario = (a: Asignacion) => {
  if (a.terminada) {
    return a.ultimoReporte && esAyer(a.ultimoReporte) ? "Terminado ayer" : "Terminado";
  }
  const mismoDia = aFecha(a.fechaHoraInicio).toDateString() === aFecha(a.fechaHoraFin).toDateString();
  return mismoDia
    ? `${hora(a.fechaHoraInicio)} a ${hora(a.fechaHoraFin)} h`
    : `${diaMes(a.fechaHoraInicio)} a ${diaMes(a.fechaHoraFin)}`;
};

interface AsignacionCardProps {
  asignacion: Asignacion;
  seleccionada: boolean;
  onSeleccionar: () => void;
}

const AsignacionCard = ({ asignacion: a, seleccionada, onSeleccionar }: AsignacionCardProps) => {
  const avance = porcentajeAvance(a);

  return (
    <button
      type="button"
      aria-pressed={seleccionada}
      className={`ui-card taller-card ${seleccionada ? "is-selected" : ""} ${a.terminada ? "is-terminada" : ""}`}
      onClick={onSeleccionar}
    >
      <span className="taller-card__fila">
        <strong>{a.folio}</strong>
        <span>{horario(a)}</span>
      </span>
      <span className="taller-card__producto">
        {a.producto} · {formatNumero(a.piezas)} pzas
      </span>
      <span className={`ui-progreso ${a.terminada ? "ui-progreso--completo" : ""}`}>
        <span className="ui-progreso__barra" style={{ width: `${a.terminada ? 100 : avance}%` }} />
      </span>
      <span className="taller-card__avance">
        {a.terminada || a.piezasTerminadas > 0
          ? `${formatNumero(a.piezasTerminadas)} de ${formatNumero(a.piezas)} terminadas`
          : "Por empezar"}
      </span>
    </button>
  );
};
export default AsignacionCard;
