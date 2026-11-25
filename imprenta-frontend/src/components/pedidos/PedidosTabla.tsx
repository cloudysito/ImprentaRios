import { X } from "lucide-react";
import type { PedidoResumen } from "../../types/pedido";
import { formatFechaCorta, formatNumero } from "../../utils/formato";
import EstatusBadges from "./EstatusBadges";
import "../../styles/PedidosTabla.css";
import "../../styles/UI.css";
import { Cargando } from "../Cargando";

interface PedidosTablaProps {
  pedidos: PedidoResumen[];
  seleccionadoId: string | null;
  onSeleccionar: (id: string) => void;
  cargando: boolean;
  error: string | null;
  onEliminar?: (pedido: PedidoResumen) => void;
}

const PedidosTabla = ({
  pedidos,
  seleccionadoId,
  onSeleccionar,
  cargando,
  error,
  onEliminar,
}: PedidosTablaProps) => {
  const mensaje = error ?? (pedidos.length === 0 ? "No hay pedidos con ese filtro" : null);

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
            {onEliminar && <th aria-label="Acciones"></th>}
          </tr>
        </thead>
        <tbody>
          {cargando ? (
            <tr>
              <td colSpan={onEliminar ? 7 : 6}>
                <Cargando />
              </td>
            </tr>
          ) : mensaje ? (
            <tr>
              <td colSpan={onEliminar ? 7 : 6} className="pedidos-tabla__mensaje">
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
                {onEliminar && (
                  <td>
                    {p.estado === "REGISTRADO" && (
                      <button
                        type="button"
                        className="ui-btn-x"
                        title="Eliminar pedido"
                        aria-label={`Eliminar ${p.folio}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEliminar(p);
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
export default PedidosTabla;
