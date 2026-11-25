import { AlertTriangle } from "lucide-react";
import "../../styles/PedidosTabla.css";

interface AlertaAtrasosProps {
  total: number;
  activo: boolean;
  onAlternar: () => void;
}

// Aviso sobre la tabla: cuántos pedidos ya pasaron su fecha de entrega sin terminarse
const AlertaAtrasos = ({ total, activo, onAlternar }: AlertaAtrasosProps) => {
  if (total === 0) return null;

  return (
    <div className="alerta-atrasos" role="alert">
      <AlertTriangle size={18} strokeWidth={2} />
      <span>
        {total === 1 ? "1 pedido vencido" : `${total} pedidos vencidos`}: ya pasó su fecha de entrega y no están
        terminados.
      </span>
      <button type="button" className="alerta-atrasos__boton" aria-pressed={activo} onClick={onAlternar}>
        {activo ? "Ver todos" : "Ver solo vencidos"}
      </button>
    </div>
  );
};
export default AlertaAtrasos;
