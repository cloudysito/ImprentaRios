import EstatusBadges from "../pedidos/EstatusBadges";
import { porcentajeAvance } from "../../utils/taller";
import type { Asignacion } from "../../types/taller";
import { formatNumero } from "../../utils/formato";
import { cuando, diaMes } from "../../utils/fechas";

const TrabajoEnCurso = ({ asignacion: a }: { asignacion: Asignacion }) => {
  const avance = porcentajeAvance(a);
  const detalle = [a.clienteNombre, a.nombreActividad, `Entrega ${diaMes(a.fechaEntrega)}`].filter(Boolean).join(" · ");

  return (
    <section className="ui-card taller-curso">
      <div className="taller-curso__encabezado">
        <span className="ui-eyebrow">{a.terminada ? "Trabajo terminado" : "Trabajo en curso"}</span>
        <EstatusBadges estado={a.estadoPedido} />
      </div>
      <h2 className="taller-curso__titulo">
        {a.folio} · {a.producto}
      </h2>
      <p className="taller-curso__detalle">{detalle}</p>

      <div className="taller-curso__cifra">
        <strong>{formatNumero(a.piezasTerminadas)}</strong>
        <span>de {formatNumero(a.piezas)} piezas terminadas</span>
      </div>
      <div className={`ui-progreso taller-curso__barra ${a.terminada ? "ui-progreso--completo" : ""}`}>
        <div className="ui-progreso__barra" style={{ width: `${avance}%` }} />
      </div>
      <div className="taller-curso__pie">
        <span>{avance} % de avance</span>
        <span>{a.ultimoReporte ? `Último reporte ${cuando(a.ultimoReporte)}` : "Sin reportes todavía"}</span>
      </div>
    </section>
  );
};
export default TrabajoEnCurso;
