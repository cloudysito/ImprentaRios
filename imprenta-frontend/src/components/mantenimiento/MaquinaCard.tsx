import { ESTATUS_MAQUINA_CLASE, ESTATUS_MAQUINA_LABEL, type MaquinaResumen } from "../../types/mantenimiento";
import { textoProximoServicio } from "../../utils/mantenimiento";

interface MaquinaCardProps {
  maquina: MaquinaResumen;
  seleccionada: boolean;
  onSeleccionar: () => void;
}

const MaquinaCard = ({ maquina: m, seleccionada, onSeleccionar }: MaquinaCardProps) => (
  <button
    type="button"
    aria-pressed={seleccionada}
    className={`ui-card maquina-card ${seleccionada ? "is-selected" : ""}`}
    onClick={onSeleccionar}
  >
    <strong className="maquina-card__nombre">{m.nombre}</strong>
    {m.descripcion && <span className="maquina-card__descripcion">{m.descripcion}</span>}
    <span className="maquina-card__pie">
      <span className={m.estatus === "ATRASADO" ? "maquina-card__vencido" : ""}>{textoProximoServicio(m)}</span>
      <span className={`ui-badge ui-badge--${ESTATUS_MAQUINA_CLASE[m.estatus]}`}>{ESTATUS_MAQUINA_LABEL[m.estatus]}</span>
    </span>
  </button>
);
export default MaquinaCard;
