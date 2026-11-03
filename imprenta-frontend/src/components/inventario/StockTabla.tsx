import { ESTATUS_STOCK_CLASE, ESTATUS_STOCK_LABEL, type Insumo } from "../../types/inventario";
import { formatNumero } from "../../utils/formato";
import { diaMes } from "../../utils/fechas";

interface StockTablaProps {
  insumos: Insumo[];
  cargando: boolean;
  error: string | null;
  editando: boolean;
  puntos: Record<string, string>;
  onPuntoChange: (id: string, valor: string) => void;
}

const StockTabla = ({ insumos, cargando, error, editando, puntos, onPuntoChange }: StockTablaProps) => {
  const mensaje = cargando
    ? "Cargando inventario…"
    : error ?? (insumos.length === 0 ? "Todavía no hay materiales registrados" : null);

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
          </tr>
        </thead>
        <tbody>
          {mensaje ? (
            <tr>
              <td colSpan={6} className="ui-vacio">
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
export default StockTabla;
