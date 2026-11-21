import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { rolLabels, type Empleado } from "../../services/authService";
import { listarEmpleados } from "../../services/empleadoService";
import type { CronogramaDetalle } from "../../types/cronograma";
import { formatFechaCorta, formatFechaLarga, formatNumero } from "../../utils/formato";
import { mensajeDeError } from "../../utils/errores";
import Modal from "../ui/Modal";
import CronogramaBadge from "./CronogramaBadge";
import "../../styles/DetalleFolio.css";
import "../../styles/GenerarCronograma.css";
import { Cargando } from "../Cargando";

interface DetalleCronogramaProps {
    detalle: CronogramaDetalle | null;
    cargando: boolean;
    guardando: boolean;
    error: string | null;
    onGenerar: (empleadoId: string) => Promise<CronogramaDetalle | null>;
    onEliminar: () => Promise<CronogramaDetalle | null>;
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
                               const [errorEmpleados, setErrorEmpleados] = useState<string | null>(null);
                               const [confirmacion, setConfirmacion] = useState<"generar" | "eliminar" | null>(null);
                               const [empleadosCargados, setEmpleadosCargados] = useState(false);
                               const [pedidoIntentoGeneracion, setPedidoIntentoGeneracion] = useState<string | null>(null);
                               const { user } = useAuth();
    // Solo el dueño genera o elimina cronogramas, los demás roles solo los consultan
    const esDueno = user?.rol === "DUENO";

    const [empleados, setEmpleados] = useState<Empleado[]>([]);

    // Solo el dueño puede listar empleados, y solo él ve este selector
    useEffect(() => {
        if (!esDueno) return;
        let vigente = true;
        listarEmpleados()
            .then((data) => {
                if (vigente) {
                    setEmpleados(data.filter((e) => e.activo !== false));
                    setErrorEmpleados(null);
                }
            })
            .catch((err) => {
                if (vigente) {
                    setErrorEmpleados(mensajeDeError(err, "No se pudieron cargar los empleados"));
                }
            })
            .finally(() => {
                if (vigente) setEmpleadosCargados(true);
            });
        return () => {
            vigente = false;
        };
    }, [esDueno]);
    const cargandoEmpleados = esDueno && !empleadosCargados;

    if (cargando || !detalle) {
        return (
            <aside className="detalle-folio detalle-folio--vacio">
                {cargando ? <Cargando /> : "Selecciona un pedido para generar su cronograma"}
            </aside>
        );
    }

    const tieneActividades = detalle.actividades.length > 0;
    // Los pedidos cerrados pueden recibir un cronograma inicial, pero no regenerarse.
    const puedeRegenerar = !["TERMINADO", "ENTREGADO", "CANCELADO"].includes(detalle.estado);

    const solicitarGeneracion = () => {
        setPedidoIntentoGeneracion(detalle.id);
        if (tieneActividades && !puedeRegenerar) return;
        setConfirmacion("generar");
    };

    const confirmarAccion = async () => {
        if (confirmacion === "generar" && tieneActividades && !puedeRegenerar) {
            setConfirmacion(null);
            return;
        }
        const actualizado = confirmacion === "generar"
            ? await onGenerar(empleadoId)
            : await onEliminar();
        if (actualizado) setConfirmacion(null);
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

            {esDueno && (
                <label className="detalle-folio__campo">
                    Empleado responsable
                    <select
                        className="detalle-folio__input"
                        value={empleadoId}
                        onChange={(e) => setEmpleadoId(e.target.value)}
                        disabled={guardando}
                    >
                        <option value="">Selecciona un empleado</option>
                        {empleados.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.nombre} · {rolLabels[e.rol]}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            {esDueno && errorEmpleados && (
                <p className="detalle-folio__error" role="alert">{errorEmpleados}</p>
            )}
            {esDueno && !cargandoEmpleados && !errorEmpleados && empleados.length === 0 && (
                <p className="detalle-folio__error" role="status">
                    No hay empleados activos disponibles para asignar.
                </p>
            )}
            {esDueno && cargandoEmpleados && <p className="detalle-folio__cliente">Cargando empleados…</p>}
            {tieneActividades && !puedeRegenerar && pedidoIntentoGeneracion === detalle.id && (
                <p className="detalle-folio__error" role="status">
                    No se puede regenerar el cronograma de un pedido terminado, entregado o cancelado.
                </p>
            )}

            {error && <p className="detalle-folio__error">{error}</p>}

            {esDueno && (
            <div className="detalle-folio__acciones">
                <button
                    type="button"
                    className="detalle-folio__btn detalle-folio__btn--primario"
                    onClick={solicitarGeneracion}
                    disabled={guardando || cargandoEmpleados || empleadoId.trim() === "" || empleados.length === 0 || Boolean(errorEmpleados)}
                >
                    {guardando ? "Guardando…" : tieneActividades ? "Regenerar cronograma" : "Generar cronograma"}
                </button>
                <button
                    type="button"
                    className="detalle-folio__btn"
                    onClick={() => setConfirmacion("eliminar")}
                    disabled={!tieneActividades || guardando}
                >
                    Eliminar cronograma
                </button>
            </div>
            )}
            {confirmacion && (
                <Modal
                    titulo={confirmacion === "generar"
                        ? tieneActividades ? "Regenerar cronograma" : "Generar cronograma"
                        : "Eliminar cronograma"}
                    onCerrar={() => {
                        if (!guardando) setConfirmacion(null);
                    }}
                >
                    <p>
                        {confirmacion === "generar"
                            ? tieneActividades
                                ? `¿Reemplazar las actividades actuales del folio ${detalle.folio}?`
                                : `¿Generar el cronograma para el folio ${detalle.folio}?`
                            : `¿Eliminar todas las actividades del cronograma del folio ${detalle.folio}?`}
                    </p>
                    {error && <p className="ui-error" role="alert">{error}</p>}
                    <div className="ui-modal__acciones">
                        <button
                            type="button"
                            className="ui-btn ui-btn--contorno"
                            onClick={() => setConfirmacion(null)}
                            disabled={guardando}
                        >
                            Volver
                        </button>
                        <button
                            type="button"
                            className="ui-btn ui-btn--primario"
                            onClick={() => void confirmarAccion()}
                            disabled={guardando || (confirmacion === "generar" && empleadoId.trim() === "")}
                        >
                            {guardando
                                ? "Guardando…"
                                : confirmacion === "eliminar"
                                    ? "Sí, eliminar"
                                    : tieneActividades ? "Sí, regenerar" : "Sí, generar"}
                        </button>
                    </div>
                </Modal>
            )}
        </aside>
    );
};
export default DetalleCronograma;