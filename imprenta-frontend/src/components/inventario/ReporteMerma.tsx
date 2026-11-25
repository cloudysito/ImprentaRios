import { useReporteMerma } from "../../hooks/useReporteMerma";
import { formatNumero } from "../../utils/formato";
import { Cargando } from "../Cargando";
import "../../styles/UI.css";
import "../../styles/GestionarStock.css";

const porcentaje = (n: number) => `${n.toLocaleString("es-MX", { maximumFractionDigits: 1 })} %`;

// Merma reportada por el taller en el mes: cuánto material se desperdició y por qué
const ReporteMerma = () => {
  const { reporte, cargando, error } = useReporteMerma();

  return (
    <section className="reporte-merma" aria-label="Reporte de merma del mes">
      <h2 className="ui-eyebrow">Merma del mes</h2>

      {cargando ? (
        <Cargando />
      ) : error ? (
        <p className="ui-error">{error}</p>
      ) : !reporte || (reporte.totalMerma === 0 && reporte.porPedido.length === 0) ? (
        <p className="reporte-merma__vacio">El taller no ha reportado merma en este periodo.</p>
      ) : (
        <>
          <div className="reporte-merma__kpis">
            <div>
              <span>Piezas desperdiciadas</span>
              <strong>{formatNumero(reporte.totalMerma)}</strong>
            </div>
            <div>
              <span>Piezas terminadas</span>
              <strong>{formatNumero(reporte.totalPiezasTerminadas)}</strong>
            </div>
            <div className={reporte.porcentajeMerma >= 5 ? "is-alto" : ""}>
              <span>% de merma</span>
              <strong>{porcentaje(reporte.porcentajeMerma)}</strong>
            </div>
          </div>

          <div className="reporte-merma__tablas">
            <table>
              <caption>Por motivo</caption>
              <thead>
                <tr>
                  <th>Motivo</th>
                  <th className="is-num">Piezas</th>
                  <th className="is-num">Del total</th>
                </tr>
              </thead>
              <tbody>
                {reporte.porMotivo.map((m) => (
                  <tr key={m.motivo}>
                    <td>{m.motivo}</td>
                    <td className="is-num">{formatNumero(m.merma)}</td>
                    <td className="is-num">{porcentaje(m.porcentajeDelTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table>
              <caption>Por pedido</caption>
              <thead>
                <tr>
                  <th>Folio</th>
                  <th className="is-num">Merma</th>
                  <th className="is-num">% del pedido</th>
                </tr>
              </thead>
              <tbody>
                {reporte.porPedido.map((p) => (
                  <tr key={p.pedidoId} className={p.porcentajeMerma >= 5 ? "is-alto" : ""}>
                    <td title={p.proyecto}>{p.folio}</td>
                    <td className="is-num">{formatNumero(p.merma)}</td>
                    <td className="is-num">{porcentaje(p.porcentajeMerma)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};
export default ReporteMerma;
