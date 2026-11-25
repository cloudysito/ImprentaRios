import { ESTATUS_STOCK_CLASE, ESTATUS_STOCK_LABEL, type Insumo } from "../../types/inventario";
import { formatNumero } from "../../utils/formato";
import { diaMes } from "../../utils/fechas";
import { Cargando } from "../Cargando";
import { Pencil, Trash2 } from "lucide-react";

interface StockTablaProps {
  insumos: Insumo[];
  cargando: boolean;
  error: string | null;
  editando: boolean;
  puntos: Record<string, string>;
  onPuntoChange: (id: string, valor: string) => void;
  onEditar?: (insumo: Insumo) => void;
  onEliminar?: (insumo: Insumo) => void;
}

const StockTabla = ({ insumos, cargando, error, editando, puntos, onPuntoChange, onEditar, onEliminar }: StockTablaProps) => {
  const conAcciones = Boolean(onEditar || onEliminar);
  const columnas = conAcciones ? 7 : 6;
  const mensaje = error ?? (insumos.length === 0 ? "Todavía no hay materiales registrados" : null);

  return (
    <div className="ui-card stock-tabla">
      <table>
        <thead>
          <tr>
            <th>Material</th>
            <th className="is-num">Existencia</th>
            <th>Unidad</th>
            <th className="is-num">Punto de reorden</th>
            <th>Estatus</th>
            <th>Última entrada</th>
            {conAcciones && <th aria-label="Acciones"></th>}
          </tr>
        </thead>
        <tbody>
          {cargando ? (
            <tr>
              <td colSpan={columnas}>
                <Cargando />
              </td>
            </tr>
          ) : mensaje ? (
            <tr>
              <td colSpan={columnas} className="ui-vacio">
                {mensaje}
              </td>
            </tr>
          ) : (
            insumos.map((i) => (
              <tr key={i.id} className={`stock-tabla__fila--${i.estatus.toLowerCase()}`}>
                <td className="stock-tabla__nombre">{i.nombre}</td>
                <td className="is-num">{formatNumero(i.cantidadDisponible)}</td>
                <td>{i.unidad}</td>
                <td className="is-num">
                  {editando ? (
                    <input
                      type="number"
                      min={0}
                      step={1}
                      className="ui-input ui-input--chico"
                      aria-label={`Punto de reorden de ${i.nombre}`}
                      value={puntos[i.id] ?? String(i.puntoReorden)}
                      onChange={(e) => onPuntoChange(i.id, e.target.value)}
                    />
                  ) : (
                    formatNumero(i.puntoReorden)
                  )}
                </td>
                <td>
                  <span className={`ui-badge ui-badge--${ESTATUS_STOCK_CLASE[i.estatus]}`}>
                    {ESTATUS_STOCK_LABEL[i.estatus]}
                  </span>
                </td>
                <td className="stock-tabla__fecha">{i.ultimaEntrada ? diaMes(i.ultimaEntrada) : "Sin entradas"}</td>
                {conAcciones && (
                    <td className="stock-tabla__acciones">
                      {onEditar && (
                          <button type="button" className="ui-btn-x" onClick={() => onEditar(i)} disabled={editando}
                                  aria-label={`Editar ${i.nombre}`} title="Editar"><Pencil size={16} /></button>
                      )}
                      {onEliminar && (
                          <button type="button" className="ui-btn-x" onClick={() => onEliminar(i)} disabled={editando}
                                  aria-label={`Eliminar ${i.nombre}`} title="Eliminar"><Trash2 size={16} /></button>
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
export default StockTabla;
