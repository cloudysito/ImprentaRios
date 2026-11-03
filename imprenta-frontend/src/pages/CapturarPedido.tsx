import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCapturaPedido, type Disponibilidad } from "../hooks/useCapturaPedido";
import { diaMesAnio, hoyISO } from "../utils/fechas";
import { ACABADOS, PRIORIDADES, TINTAS } from "../types/capturaPedido";
import type { Material } from "../types/capturaPedido";
import "../styles/CapturarPedido.css";

const nombreMaterial = (m: Material) => (m.gramaje ? `${m.nombre} ${m.gramaje} g` : m.nombre);

const numero = (n: number) => n.toLocaleString("es-MX");

interface CampoProps {
    id: string;
    etiqueta: string;
    obligatorio?: boolean;
    error?: string;
    completo?: boolean;
    children: React.ReactNode;
}

const Campo = ({ id, etiqueta, obligatorio, error, completo, children }: CampoProps) => (
    <div className={`form-group${completo ? " full-width mt-2" : ""}${error ? " has-error" : ""}`}>
        <label htmlFor={id}>
            {etiqueta} {obligatorio && <span>*</span>}
        </label>
        {children}
        {error && <small className="field-error">{error}</small>}
    </div>
);

const TarjetaDisponibilidad = ({ d }: { d: Disponibilidad }) => {
    let clase = "neutral";
    let texto: string;

    switch (d.tipo) {
        case "sin-material":
            texto = "Elige un material para ver su existencia.";
            break;
        case "sin-insumo":
            texto = `${nombreMaterial(d.material)} no está ligado a un insumo del inventario.`;
            break;
        case "cargando":
            texto = `Consultando la existencia de ${nombreMaterial(d.material)}...`;
            break;
        case "error":
            clase = "warning";
            texto = `No se pudo consultar la existencia de ${nombreMaterial(d.material)}.`;
            break;
        case "insumo": {
            const queda = `${numero(d.insumo.cantidadDisponible)} ${d.insumo.unidad}`;
            if (d.insumo.estatus === "SUFICIENTE") {
                clase = "success";
                texto = `${nombreMaterial(d.material)} con existencia suficiente, hay ${queda} disponibles.`;
            } else if (d.insumo.estatus === "POR_AGOTARSE") {
                clase = "warning";
                texto = `${nombreMaterial(d.material)} está por agotarse, quedan ${queda}.`;
            } else {
                clase = "danger";
                texto = `${nombreMaterial(d.material)} está en desabasto, quedan ${queda}. Avisa al dueño antes de comprometer la entrega.`;
            }
        }
    }

    return (
        <div className={`info-card ${clase}`} aria-live="polite">
            <h4>Disponibilidad de material</h4>
            <p>{texto}</p>
        </div>
    );
};

const CapturarPedido: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [hoy] = useState(hoyISO);
    const {
        form,
        errores,
        actualizar,
        tipos,
        materiales,
        archivos,
        cargando,
        errorCarga,
        disponibilidad,
        enviando,
        errorEnvio,
        registrado,
        borradorGuardado,
        guardarBorrador,
        registrar,
        nuevoPedido,
    } = useCapturaPedido();

    const bloqueado = cargando || enviando || registrado !== null;

    return (
        <div className="capturar-pedido-container">
            <form
                className="content-grid"
                noValidate
                onSubmit={(e) => {
                    e.preventDefault();
                    void registrar();
                }}
            >
                <section className="form-card">
                    {registrado && (
                        <div className="registro-exito" role="status">
                            <div>
                                <strong>Pedido {registrado.folio} registrado</strong>
                                <p>Ya aparece en la lista de pedidos con estado Registrado.</p>
                            </div>
                            <div className="registro-exito__acciones">
                                <button type="button" className="btn-secondary" onClick={() => navigate("/pedidos")}>
                                    Ver pedidos
                                </button>
                                <button type="button" className="btn-primary" onClick={nuevoPedido}>
                                    Capturar otro
                                </button>
                            </div>
                        </div>
                    )}

                    {errorCarga && (
                        <div className="form-alert" role="alert">
                            {errorCarga}
                        </div>
                    )}

                    <fieldset className="captura-campos" disabled={bloqueado}>
                        <div className="section-header">
                            <h2>DATOS DEL CLIENTE</h2>
                            <span className="required-note">* Campos obligatorios</span>
                        </div>

                        <div className="form-row">
                            <Campo id="cp-nombreCliente" etiqueta="Nombre o razón social" obligatorio error={errores.nombreCliente}>
                                <input
                                    id="cp-nombreCliente"
                                    type="text"
                                    value={form.nombreCliente}
                                    onChange={(e) => actualizar("nombreCliente", e.target.value)}
                                    placeholder="Ej. Papelería El Trébol S.A. de C.V."
                                />
                            </Campo>
                            <Campo id="cp-telefono" etiqueta="Teléfono de contacto" obligatorio error={errores.telefono}>
                                <input
                                    id="cp-telefono"
                                    type="tel"
                                    value={form.telefono}
                                    onChange={(e) => actualizar("telefono", e.target.value)}
                                    placeholder="Ej. 644 118 22 40"
                                />
                            </Campo>
                        </div>

                        <div className="form-row">
                            <Campo id="cp-correo" etiqueta="Correo electrónico" error={errores.correo}>
                                <input
                                    id="cp-correo"
                                    type="email"
                                    value={form.correo}
                                    onChange={(e) => actualizar("correo", e.target.value)}
                                    placeholder="Ej. compras@eltrebol.mx"
                                />
                            </Campo>
                            <Campo id="cp-personaSolicita" etiqueta="Persona que solicita" error={errores.personaSolicita}>
                                <input
                                    id="cp-personaSolicita"
                                    type="text"
                                    value={form.personaSolicita}
                                    onChange={(e) => actualizar("personaSolicita", e.target.value)}
                                    placeholder="Ej. Ing. Laura Beltrán"
                                />
                            </Campo>
                        </div>

                        <h2 className="section-title mt-4">ESPECIFICACIONES DEL TRABAJO</h2>
                        <div className="form-row three-cols">
                            <Campo id="cp-nombreProyecto" etiqueta="Nombre del trabajo" obligatorio error={errores.nombreProyecto}>
                                <input
                                    id="cp-nombreProyecto"
                                    type="text"
                                    value={form.nombreProyecto}
                                    onChange={(e) => actualizar("nombreProyecto", e.target.value)}
                                    placeholder="Ej. Volantes promoción otoño"
                                />
                            </Campo>
                            <Campo id="cp-fechaEntrega" etiqueta="Fecha de entrega" obligatorio error={errores.fechaEntrega}>
                                <input
                                    id="cp-fechaEntrega"
                                    type="date"
                                    min={hoy}
                                    value={form.fechaEntrega}
                                    onChange={(e) => actualizar("fechaEntrega", e.target.value)}
                                />
                            </Campo>
                            <Campo id="cp-prioridad" etiqueta="Prioridad" obligatorio>
                                <select
                                    id="cp-prioridad"
                                    value={form.prioridad}
                                    onChange={(e) => actualizar("prioridad", e.target.value as typeof form.prioridad)}
                                >
                                    {PRIORIDADES.map((p) => (
                                        <option key={p.valor} value={p.valor}>
                                            {p.texto}
                                        </option>
                                    ))}
                                </select>
                            </Campo>
                        </div>

                        <div className="form-row three-cols">
                            <Campo id="cp-tipoProductoId" etiqueta="Tipo de producto" obligatorio error={errores.tipoProductoId}>
                                <select
                                    id="cp-tipoProductoId"
                                    value={form.tipoProductoId}
                                    onChange={(e) => actualizar("tipoProductoId", e.target.value)}
                                >
                                    <option value="" disabled>
                                        {tipos.length ? "Seleccionar..." : "No hay tipos registrados"}
                                    </option>
                                    {tipos.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.nombre}
                                        </option>
                                    ))}
                                </select>
                            </Campo>
                            <Campo id="cp-cantidad" etiqueta="Cantidad (piezas)" obligatorio error={errores.cantidad}>
                                <input
                                    id="cp-cantidad"
                                    type="number"
                                    min={1}
                                    step={1}
                                    value={form.cantidad}
                                    onChange={(e) => actualizar("cantidad", e.target.value)}
                                    placeholder="0"
                                />
                            </Campo>
                            <Campo id="cp-materialId" etiqueta="Material" obligatorio error={errores.materialId}>
                                <select
                                    id="cp-materialId"
                                    value={form.materialId}
                                    onChange={(e) => actualizar("materialId", e.target.value)}
                                >
                                    <option value="" disabled>
                                        {materiales.length ? "Seleccionar..." : "No hay materiales registrados"}
                                    </option>
                                    {materiales.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {nombreMaterial(m)}
                                        </option>
                                    ))}
                                </select>
                            </Campo>
                        </div>

                        <div className="form-row three-cols">
                            <Campo id="cp-medidas" etiqueta="Medida final" obligatorio error={errores.medidas}>
                                <input
                                    id="cp-medidas"
                                    type="text"
                                    value={form.medidas}
                                    onChange={(e) => actualizar("medidas", e.target.value)}
                                    placeholder="Ej. 21.5 x 14 cm"
                                />
                            </Campo>
                            <Campo id="cp-tinta" etiqueta="Tintas" obligatorio error={errores.tinta}>
                                <select
                                    id="cp-tinta"
                                    value={form.tinta}
                                    onChange={(e) => actualizar("tinta", e.target.value as typeof form.tinta)}
                                >
                                    <option value="" disabled>
                                        Seleccionar...
                                    </option>
                                    {TINTAS.map((t) => (
                                        <option key={t.valor} value={t.valor}>
                                            {t.texto}
                                        </option>
                                    ))}
                                </select>
                            </Campo>
                            <Campo id="cp-tipoAcabado" etiqueta="Acabado">
                                <select
                                    id="cp-tipoAcabado"
                                    value={form.tipoAcabado}
                                    onChange={(e) =>
                                        actualizar("tipoAcabado", e.target.value as typeof form.tipoAcabado)
                                    }
                                >
                                    {ACABADOS.map((a) => (
                                        <option key={a.valor} value={a.valor}>
                                            {a.texto}
                                        </option>
                                    ))}
                                </select>
                            </Campo>
                        </div>

                        <Campo id="cp-observaciones" etiqueta="Observaciones para producción" completo error={errores.observaciones}>
                            <textarea
                                    id="cp-observaciones"
                                rows={2}
                                value={form.observaciones}
                                onChange={(e) => actualizar("observaciones", e.target.value)}
                                placeholder="Añade detalles o instrucciones específicas..."
                            />
                        </Campo>

                        <h2 className="section-title mt-4">DISEÑO AL QUE SE VINCULA</h2>
                        <Campo id="cp-archivoDisenioId" etiqueta="Archivo de diseño (opcional)" completo>
                            <select
                                    id="cp-archivoDisenioId"
                                value={form.archivoDisenioId}
                                onChange={(e) => actualizar("archivoDisenioId", e.target.value)}
                            >
                                <option value="">
                                    {archivos.length ? "Sin archivo por ahora" : "No hay archivos registrados"}
                                </option>
                                {archivos.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.nombreArchivo}
                                        {a.version ? ` · v${a.version}` : ""}
                                    </option>
                                ))}
                            </select>
                        </Campo>
                    </fieldset>
                </section>

                <aside className="summary-sidebar">
                    <div className="summary-card">
                        <h3>FOLIO</h3>
                        <h2 className="folio-number">{registrado?.folio ?? `PED-${hoy.slice(0, 4)}-····`}</h2>
                        {registrado ? (
                            <span className="badge registrado">Registrado</span>
                        ) : (
                            <span className="badge draft">
                                {borradorGuardado ? "Borrador guardado" : "Borrador sin registrar"}
                            </span>
                        )}

                        <div className="summary-details">
                            <div className="detail-row">
                                <span>Capturado por</span>
                                <strong>{user?.nombre ?? "-"}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Fecha de captura</span>
                                <strong>{diaMesAnio(registrado ? registrado.fechaRegistro : hoy)}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Fecha de entrega</span>
                                <strong>{form.fechaEntrega ? diaMesAnio(form.fechaEntrega) : "-"}</strong>
                            </div>
                        </div>
                    </div>

                    <div className={`summary-card${errores.precioAcordado ? " has-error" : ""}`}>
                        <h3>PRECIO ACORDADO</h3>
                        <div className="price-input">
                            <span className="currency-symbol">$</span>
                            <input
                                type="number"
                                min={0}
                                step="0.01"
                                aria-label="Precio acordado"
                                value={form.precioAcordado}
                                disabled={bloqueado}
                                onChange={(e) => actualizar("precioAcordado", e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        {errores.precioAcordado && <small className="field-error">{errores.precioAcordado}</small>}
                        <p className="warning-text">
                            <span className="icon">!</span> El costo puede variar o cambiar en el futuro.
                        </p>
                    </div>

                    <TarjetaDisponibilidad d={disponibilidad} />

                    {errorEnvio && (
                        <div className="form-alert" role="alert">
                            {errorEnvio}
                        </div>
                    )}

                    {!registrado && (
                        <div className="action-buttons">
                            <button className="btn-primary" type="submit" disabled={cargando || enviando}>
                                {enviando ? "Registrando..." : "Registrar pedido"}
                            </button>
                            <button
                                className="btn-secondary"
                                type="button"
                                disabled={cargando || enviando}
                                onClick={guardarBorrador}
                            >
                                Guardar borrador
                            </button>
                        </div>
                    )}
                </aside>
            </form>
        </div>
    );
};

export default CapturarPedido;
