import { ESTADO_CRONOGRAMA_LABEL, type EstadoCronograma } from "../../types/cronograma";
import "../../styles/EstatusBadge.css";
import "../../styles/GenerarCronograma.css";

const CronogramaBadge = ({ estado }: { estado: EstadoCronograma }) => (
    <span className={`estatus-badge estatus-badge--${estado.toLowerCase()}`}>
    {ESTADO_CRONOGRAMA_LABEL[estado]}
  </span>
);
export default CronogramaBadge;