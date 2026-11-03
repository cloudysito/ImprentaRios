import type { PedidoResumen } from "../../types/pedido";
import { formatFechaCorta, formatNumero } from "../../utils/formato";
import EstatusBadges from "./EstatusBadges";
import "../../styles/PedidosTabla.css";

interface PedidosTablaProps {
  pedidos: PedidoResumen[];
  seleccionadoId: string | null;
  onSeleccionar: (id: string) => void;
  cargando: boolean;
  error: string | null;
}

const PedidosTabla = ({
  pedidos,
  seleccionadoId,
  onSeleccionar,
  cargando,
  error,
}: PedidosTablaProps) => {
  const mensaje = cargando
    ? "Cargando pedidos…"
    : error ?? (pedidos.length === 0 ? "No hay pedidos con ese filtro" : null);

  return (
    <div className="pedidos-tabla">
      <table>
        <thead>
          <tr>
            <th>Folio</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th className="is-num">Piezas</th>
            <th>Entrega</th>
            <th>Estatus</th>
          </tr>
        </thead>
        <tbody>
          {mensaje ? (
            <tr>
              <td colSpan={6} className="pedidos-tabla__mensaje">
                {mensaje}
              </td>
            </tr>
          ) : (
            pedidos.map((p) => (
              <tr
                key={p.id}
                className={p.id === seleccionadoId ? "is-selected" : ""}
                onClick={() => onSeleccionar(p.id)}
                onKeyDown={(e) => e.key === "Enter" && onSeleccionar(p.id)}
                tabIndex={0}
                aria-selected={p.id === seleccionadoId}
              >
                <td className="pedidos-tabla__folio">{p.folio}</td>
                <td>{p.clienteNombre}</td>
                <td>{p.producto}</td>
                <td className="is-num">{formatNumero(p.piezas)}</td>
                <td>{formatFechaCorta(p.fechaEntrega)}</td>
                <td>
                  <EstatusBadges estado={p.estado} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
export default PedidosTabla;
