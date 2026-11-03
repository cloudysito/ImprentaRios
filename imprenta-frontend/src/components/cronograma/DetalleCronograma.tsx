import { useState } from "react";
import type { CronogramaDetalle } from "../../types/cronograma";
import { formatFechaCorta, formatFechaLarga, formatNumero } from "../../utils/formato";
import CronogramaBadge from "./CronogramaBadge";
import "../../styles/DetalleFolio.css";
import "../../styles/GenerarCronograma.css";

interface DetalleCronogramaProps {
    detalle: CronogramaDetalle | null;
    cargando: boolean;
    guardando: boolean;
    error: string | null;
    onGenerar: (empleadoId: string) => void;
    onEliminar: () => void;
}

const DetalleCronograma = ({
                               detalle,
                               cargando,
                               guardando,
                               error,
                               onGenerar,
                               onEliminar,
                           }: DetalleCronogramaProps) => {
    const [empleadoId, setEmpleadoId] = useState("");

    if (cargando || !detalle) {
        return (
            <aside className="detalle-folio detalle-folio--vacio">
                {cargando ? "Cargando pedido…" : "Selecciona un pedido para generar su cronograma"}
            </aside>
        );
    }

    const tieneActividades = detalle.actividades.length > 0;
    // Regla de negocio: no se planea lo que ya terminó o se canceló
    const puedeGenerar = !["TERMINADO", "ENTREGADO", "CANCELADO"].includes(detalle.estado);

    const handleGenerar = () => {
        if (tieneActividades && !window.confirm("Esto reemplaza el cronograma actual. ¿Continuar?")) {
            return;
        }
        onGenerar(empleadoId);
    };

    const handleEliminar = () => {
        if (window.confirm("¿Eliminar todas las actividades de este cronograma?")) onEliminar();
    };

    return (
        <aside className="detalle-folio">
            <span className="detalle-folio__eyebrow">Cronograma del folio</span>
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
                    <dt>Cronograma</dt>
                    <dd>
                        <CronogramaBadge estado={detalle.estadoCronograma} />
                    </dd>
                </div>
            </dl>

            <span className="detalle-folio__eyebrow">Etapas</span>
            {tieneActividades ? (
                <ul className="detalle-folio__bitacora">
                    {detalle.actividades.map((a) => (
                        <li key={a.id}>
                            <strong>{a.nombreActividad}</strong> · {formatFechaCorta(a.fechaHoraInicio)}
                            {formatFechaCorta(a.fechaHoraInicio) !== formatFechaCorta(a.fechaHoraFin) && (
                                <> → {formatFechaCorta(a.fechaHoraFin)}</>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="detalle-folio__cliente">Este pedido aún no tiene cronograma.</p>
            )}

            <label className="detalle-folio__campo">
                ID del empleado responsable
                <input
                    className="detalle-folio__input"
                    type="text"
                    value={empleadoId}
                    onChange={(e) => setEmpleadoId(e.target.value)}
                    placeholder="Ej. 66f1a2b3c4d5e6f7a8b9c0d1"
                    disabled={!puedeGenerar || guardando}
                />
            </label>

            {error && <p className="detalle-folio__error">{error}</p>}

            <div className="detalle-folio__acciones">
                <button
                    type="button"
                    className="detalle-folio__btn detalle-folio__btn--primario"
                    onClick={handleGenerar}
                    disabled={!puedeGenerar || guardando || empleadoId.trim() === ""}
                >
                    {guardando ? "Guardando…" : tieneActividades ? "Regenerar cronograma" : "Generar cronograma"}
                </button>
                <button
                    type="button"
                    className="detalle-folio__btn"
                    onClick={handleEliminar}
                    disabled={!tieneActividades || guardando}
                >
                    Eliminar cronograma
                </button>
            </div>
        </aside>
    );
};
export default DetalleCronograma;