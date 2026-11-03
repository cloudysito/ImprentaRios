import type { PedidoDetalle } from "../../types/pedido";
import { formatFechaCorta, formatFechaLarga, formatNumero } from "../../utils/formato";
import "../../styles/DetalleFolio.css";

interface DetalleFolioProps {
  detalle: PedidoDetalle | null;
  cargando: boolean;
  guardando: boolean;
  error: string | null;
  onMarcarEntregado: () => void;
  onCerrarFolio: () => void;
}

const DetalleFolio = ({
  detalle,
  cargando,
  guardando,
  error,
  onMarcarEntregado,
  onCerrarFolio,
}: DetalleFolioProps) => {
  if (cargando || !detalle) {
    return (
      <aside className="detalle-folio detalle-folio--vacio">
        {cargando ? "Cargando folio…" : "Selecciona un pedido para ver su detalle"}
      </aside>
    );
  }

  // Regla de negocio, solo se entrega lo que ya está terminado
  const puedeEntregar = detalle.estado === "TERMINADO";

  return (
    <aside className="detalle-folio">
      <span className="detalle-folio__eyebrow">Detalle del folio</span>
      <h2 className="detalle-folio__folio">{detalle.folio}</h2>
      <p className="detalle-folio__cliente">{detalle.clienteNombre}</p>

      <dl className="detalle-folio__datos">
        <div>
          <dt>Producto</dt>
          <dd>{detalle.producto}</dd>
        </div>
        <div>
          <dt>Cantidad</dt>
          <dd>{formatNumero(detalle.piezas)} piezas</dd>
        </div>
        <div>
          <dt>Entrega acordada</dt>
          <dd>{formatFechaLarga(detalle.fechaEntrega)}</dd>
        </div>
        <div>
          <dt>Archivo de diseño</dt>
          <dd className={detalle.versionDisenio ? "is-ok" : "is-muted"}>
            {detalle.versionDisenio ? `Vinculado ${detalle.versionDisenio}` : "Sin archivo"}
          </dd>
        </div>
        <div>
          <dt>Producción</dt>
          <dd>
            {formatNumero(detalle.piezasTerminadas)} de {formatNumero(detalle.piezas)} terminadas
          </dd>
        </div>
      </dl>

      <span className="detalle-folio__eyebrow">Bitácora del folio</span>
      <ul className="detalle-folio__bitacora">
        {detalle.bitacora.map((evento, i) => (
          <li key={i}>
            <strong>{formatFechaCorta(evento.fecha)}</strong> · {evento.descripcion}
          </li>
        ))}
      </ul>

      {error && <p className="detalle-folio__error">{error}</p>}

      <div className="detalle-folio__acciones">
        <button
          type="button"
          className="detalle-folio__btn detalle-folio__btn--primario"
          onClick={onMarcarEntregado}
          disabled={!puedeEntregar || guardando}
        >
          {guardando ? "Guardando…" : "Marcar como entregado"}
        </button>
        <button type="button" className="detalle-folio__btn" onClick={onCerrarFolio}>
          Cerrar folio
        </button>
      </div>
    </aside>
  );
};
export default DetalleFolio;
