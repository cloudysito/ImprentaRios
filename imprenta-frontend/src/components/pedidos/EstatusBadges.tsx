import { ESTADO_LABEL, type EstadoPedido } from "../../types/pedido";
import "../../styles/EstatusBadge.css";

interface EstatusBadgesProps {
  estado: EstadoPedido;
}

const EstatusBadges = ({ estado }: EstatusBadgesProps) => (
  <span className={`estatus-badge estatus-badge--${estado.toLowerCase()}`}>
    {ESTADO_LABEL[estado]}
  </span>
);
export default EstatusBadges;
