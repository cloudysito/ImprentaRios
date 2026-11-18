import type { PedidoDetalle } from "../../types/pedido";
import { diaMes } from "../../utils/fechas";
import { formatNumero } from "../../utils/formato";
import "../../styles/Consulta.css";
import "../../styles/ConsultarCronograma.css";

interface DetalleSeleccionadoProps {
    detalle: PedidoDetalle | null;
    cargando: boolean;
}

const DetalleSeleccionado = ({ detalle, cargando }: DetalleSeleccionadoProps) => {
    const porcentaje =
        detalle && detalle.piezas > 0
            ? Math.min(100, Math.round((detalle.piezasTerminadas / detalle.piezas) * 100))
            : 0;

    return (
        <section className="cons-tarjeta">
            <h2 className="cons-tarjeta__titulo">Detalle seleccionado</h2>
            {cargando || !detalle ? (
                <p className="cons-vacio">{cargando ? "Cargando pedido…" : "Selecciona un pedido del cronograma."}</p>
            ) : (
                <>
                    <p className="cg-detalle__folio">{detalle.folio}</p>
                    <p className="cg-detalle__texto">
                        {detalle.producto} · {detalle.clienteNombre}
                    </p>
                    <div
                        className="cg-progreso"
                        role="progressbar"
                        aria-valuenow={porcentaje}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <span style={{ width: `${porcentaje}%` }} />
                    </div>
                    <p className="cg-detalle__piezas">
                        {formatNumero(detalle.piezasTerminadas)} de {formatNumero(detalle.piezas)} piezas · entrega{" "}
                        {diaMes(detalle.fechaEntrega)}
                    </p>
                </>
            )}
        </section>
    );
};

export default DetalleSeleccionado;
