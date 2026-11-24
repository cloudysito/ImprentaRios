import {useEffect, useState} from "react";
import type {FormEvent} from "react";
import {useNavigate, useParams} from "react-router-dom";
import "../styles/CapturarPedido.css";
import {useCatalogosPedido} from "../hooks/useCatalogosPedido";
import {capturaService} from "../services/capturaService";
import {clienteService} from "../services/clienteService";
import {mensajeDeError} from "../utils/errores";
import {
    ACABADOS,
    PRIORIDADES,
    TINTAS,
    productoVacio,
} from "../types/captura";
import type {Cliente, ProductoForm} from "../types/captura";

const etiqueta = (v: string) =>
    v.charAt(0) + v.slice(1).toLowerCase().replace(/_/g, " ");

const CapturarPedido = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const editando = Boolean(id);

    const {
        tipos,
        materiales,
        archivos,
        cargando,
        error: errorCatalogos,
    } = useCatalogosPedido();

    const [cliente, setCliente] = useState({
        nombre: "",
        telefono: "",
        correo: "",
    });

    const [proyecto, setProyecto] = useState({
        nombreProyecto: "",
        fechaEntrega: "",
    });

    const [productos, setProductos] = useState<ProductoForm[]>([
        productoVacio(),
    ]);

    // El backend actual maneja un solo archivo de diseño.
    const [archivosDisenioIds, setArchivosDisenioIds] = useState<string[]>([]);

    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState("");
    const [folio, setFolio] = useState("");

    // Datos necesarios para editar un pedido.
    const [clienteId, setClienteId] = useState("");
    const [folioEdicion, setFolioEdicion] = useState("");

    const [conservar, setConservar] = useState<{
        personaSolicita: string | null;
        precioAcordado: number | null;
    }>({
        personaSolicita: null,
        precioAcordado: null,
    });

    const [cargandoPedido, setCargandoPedido] = useState(editando);

    // Datos para seleccionar clientes registrados.
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clienteExistenteId, setClienteExistenteId] = useState("");
    const [cargandoClientes, setCargandoClientes] = useState(true);
    const [errorClientes, setErrorClientes] = useState<string | null>(null);

    // Cargar clientes registrados.
    useEffect(() => {
        let vigente = true;

        clienteService
            .listar()
            .then((datos) => {
                if (vigente) {
                    setClientes(Array.isArray(datos) ? datos : []);
                }
            })
            .catch((err) => {
                if (vigente) {
                    setErrorClientes(
                        mensajeDeError(err, "No se pudieron cargar los clientes"),
                    );
                }
            })
            .finally(() => {
                if (vigente) {
                    setCargandoClientes(false);
                }
            });

        return () => {
            vigente = false;
        };
    }, []);

    // Cargar los datos del pedido cuando se está editando.
    useEffect(() => {
        if (!id) return;

        let vigente = true;

        const cargarPedido = async () => {
            try {
                const pedido = await capturaService.obtenerPedido(id);
                const clienteActual = await capturaService.obtenerCliente(
                    pedido.clienteId,
                );

                if (!vigente) return;

                setClienteId(pedido.clienteId);

                setCliente({
                    nombre: clienteActual.nombre,
                    telefono: clienteActual.telefono,
                    correo: clienteActual.correo ?? "",
                });

                setProyecto({
                    nombreProyecto: pedido.nombreProyecto,
                    fechaEntrega: pedido.fechaEntrega.slice(0, 16),
                });

                setArchivosDisenioIds(pedido.archivosDisenioIds ?? []);

                setConservar({
                    personaSolicita: pedido.personaSolicita,
                    precioAcordado: pedido.precioAcordado,
                });

                setProductos(
                    pedido.productos.map((p) => ({
                        ...p,
                        cantidad: String(p.cantidad),
                        observaciones: p.observaciones ?? "",
                    })),
                );

                setFolioEdicion(pedido.folio);
            } catch (err) {
                if (vigente) {
                    setError(mensajeDeError(err, "No se pudo cargar el pedido"));
                }
            } finally {
                if (vigente) {
                    setCargandoPedido(false);
                }
            }
        };

        void cargarPedido();

        return () => {
            vigente = false;
        };
    }, [id]);

    const cambiarProducto = (
        i: number,
        campo: keyof ProductoForm,
        valor: string,
    ) => {
        setProductos((prev) =>
            prev.map((p, idx) =>
                idx === i ? {...p, [campo]: valor} : p,
            ),
        );
    };

    const agregarProducto = () => {
        setProductos((prev) => [...prev, productoVacio()]);
    };

    const quitarProducto = (i: number) => {
        setProductos((prev) => prev.filter((_, idx) => idx !== i));
    };

    const enviar = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setEnviando(true);

        try {
            const datosPedido = {
                nombreProyecto: proyecto.nombreProyecto,
                fechaEntrega: proyecto.fechaEntrega,
                productos: productos.map((p) => ({
                    ...p,
                    cantidad: Number(p.cantidad),
                })),
                archivosDisenioIds,
            };

            // Actualizar un pedido existente.
            if (id) {
                await capturaService.actualizarCliente(clienteId, cliente);

                await capturaService.actualizarPedido(id, {
                    ...datosPedido,
                    clienteId,
                    ...conservar,
                });

                navigate("/pedidos");
                return;
            }

            // Crear el pedido con un cliente existente o uno nuevo.
            let idCliente = clienteExistenteId;

            if (!idCliente) {
                const nuevoCliente = await capturaService.crearCliente(cliente);
                idCliente = nuevoCliente.id;

                setClientes((actuales) => [
                    ...actuales,
                    {
                        ...cliente,
                        id: nuevoCliente.id,
                    },
                ]);

                setClienteExistenteId(idCliente);
            }

            const pedido = await capturaService.crearPedido({
                ...datosPedido,
                clienteId: idCliente,
            });

            setFolio(pedido.folio);
        } catch (err) {
            setError(
                mensajeDeError(
                    err,
                    editando
                        ? "No se pudo guardar el pedido"
                        : "No se pudo registrar el pedido",
                ),
            );
        } finally {
            setEnviando(false);
        }
    };

    if (cargandoPedido) {
        return <p>Cargando pedido…</p>;
    }

    if (editando && !clienteId) {
        return (
            <div className="capturar-pedido-container">
                <p className="error-text">
                    {error || "No se pudo cargar el pedido"}
                </p>

                <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => navigate("/pedidos")}
                >
                    Volver a pedidos
                </button>
            </div>
        );
    }

    const clientesSeguros = Array.isArray(clientes) ? clientes : [];
    const clienteSeleccionado = clientesSeguros.find(
        (c) => c.id === clienteExistenteId,
    );

    return (
        <form className="capturar-pedido-container" onSubmit={enviar}>
            <div className="content-grid">
                <section className="form-card">
                    <div className="section-header">
                        <h2>DATOS DEL CLIENTE</h2>
                        <span className="required-note">
              * Campos obligatorios
            </span>
                    </div>

                    {!editando && (
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cliente-existente">
                                    Cliente registrado
                                </label>

                                <select
                                    id="cliente-existente"
                                    value={clienteExistenteId}
                                    onChange={(e) =>
                                        setClienteExistenteId(e.target.value)
                                    }
                                >
                                    <option value="">Registrar un cliente nuevo</option>

                                    {clientesSeguros.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombre} · {c.telefono}
                                        </option>
                                    ))}
                                </select>

                                {cargandoClientes && (
                                    <small>Cargando clientes…</small>
                                )}

                                {errorClientes && (
                                    <small className="error-text">
                                        {errorClientes}
                                    </small>
                                )}
                            </div>
                        </div>
                    )}

                    {!editando && clienteExistenteId ? (
                        <div className="cliente-seleccionado">
                            <strong>
                                Nombre del cliente o razón social
                            </strong>
                            <p> </p>
                            <label>
                                {clienteSeleccionado?.nombre ?? "Cliente seleccionado"}
                            </label>
                            <p> </p>
                            <strong>
                                Teléfono de contacto
                            </strong>
                            <p> </p>
                            <span>{clienteSeleccionado?.telefono}</span>
                            <p> </p>
                            <strong>
                                Correo electrónico
                            </strong>
                            <p> </p>
                            <p> </p>
                            <span> {clienteSeleccionado?.correo || "Sin correo registrado"} </span>
                        </div>
                    ) : (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>
                                        Nombre o razón social <span>*</span>
                                    </label>

                                    <input
                                        required
                                        maxLength={100}
                                        value={cliente.nombre}
                                        onChange={(e) =>
                                            setCliente({
                                                ...cliente,
                                                nombre: e.target.value,
                                            })
                                        }
                                        placeholder="Ej. Papelería El Trébol S.A. de C.V."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Teléfono de contacto <span>*</span>
                                    </label>

                                    <input
                                        required
                                        maxLength={15}
                                        value={cliente.telefono}
                                        onChange={(e) =>
                                            setCliente({
                                                ...cliente,
                                                telefono: e.target.value,
                                            })
                                        }
                                        placeholder="Ej. 644 118 22 40"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>
                                        Correo electrónico <span>*</span>
                                    </label>

                                    <input
                                        required
                                        type="email"
                                        maxLength={100}
                                        value={cliente.correo}
                                        onChange={(e) =>
                                            setCliente({
                                                ...cliente,
                                                correo: e.target.value,
                                            })
                                        }
                                        placeholder="Ej. compras@eltrebol.mx"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <h2 className="section-title mt-4">
                        DATOS DEL PEDIDO
                    </h2>

                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                Nombre del proyecto <span>*</span>
                            </label>

                            <input
                                required
                                minLength={3}
                                maxLength={150}
                                value={proyecto.nombreProyecto}
                                onChange={(e) =>
                                    setProyecto({
                                        ...proyecto,
                                        nombreProyecto: e.target.value,
                                    })
                                }
                                placeholder="Ej. Volantes temporada navideña"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Fecha de entrega <span>*</span>
                            </label>

                            <input
                                required
                                type="datetime-local"
                                value={proyecto.fechaEntrega}
                                onChange={(e) =>
                                    setProyecto({
                                        ...proyecto,
                                        fechaEntrega: e.target.value,
                                    })
                                }
                            />

                            {editando && (
                                <small>
                                    Si cambias la fecha, regenera el cronograma en
                                    "Asignar cronograma".
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group full-width">
                            <label htmlFor="archivos-disenio">Archivos de diseño</label>

                            <div className="archivo-fila">
                                <select
                                    id="archivos-disenio"
                                    multiple
                                    value={archivosDisenioIds}
                                    onChange={(e) => setArchivosDisenioIds(
                                        Array.from(e.target.selectedOptions, (option) => option.value),
                                    )}
                                >
                                    {(Array.isArray(archivos) ? archivos : []).map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.nombreArchivo} (v{a.version ?? 1})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {productos.map((p, i) => (
                        <div className="producto-bloque" key={i}>
                            <h2 className="section-title">
                                PRODUCTO {i + 1}
                            </h2>

                            <div className="form-row three-cols">
                                <div className="form-group">
                                    <label>
                                        Tipo de producto <span>*</span>
                                    </label>

                                    <select
                                        required
                                        value={p.tipoProductoId}
                                        onChange={(e) =>
                                            cambiarProducto(
                                                i,
                                                "tipoProductoId",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="" disabled>
                                            Seleccionar...
                                        </option>

                                        {tipos.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Cantidad (piezas) <span>*</span>
                                    </label>

                                    <input
                                        required
                                        type="number"
                                        min={1}
                                        value={p.cantidad}
                                        onChange={(e) =>
                                            cambiarProducto(i, "cantidad", e.target.value)
                                        }
                                        placeholder="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Material <span>*</span>
                                    </label>

                                    <select
                                        required
                                        value={p.materialId}
                                        onChange={(e) =>
                                            cambiarProducto(i, "materialId", e.target.value)
                                        }
                                    >
                                        <option value="" disabled>
                                            Seleccionar...
                                        </option>

                                        {materiales.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.nombre} ({m.gramaje} g)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row three-cols">
                                <div className="form-group">
                                    <label>
                                        Medida final <span>*</span>
                                    </label>

                                    <input
                                        required
                                        maxLength={30}
                                        value={p.medidas}
                                        onChange={(e) =>
                                            cambiarProducto(i, "medidas", e.target.value)
                                        }
                                        placeholder="Ej. 21.5 x 14 cm"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Tintas <span>*</span>
                                    </label>

                                    <select
                                        value={p.tinta}
                                        onChange={(e) =>
                                            cambiarProducto(i, "tinta", e.target.value)
                                        }
                                    >
                                        {TINTAS.map((t) => (
                                            <option key={t} value={t}>
                                                {etiqueta(t)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Acabado</label>

                                    <select
                                        value={p.tipoAcabado}
                                        onChange={(e) =>
                                            cambiarProducto(i, "tipoAcabado", e.target.value)
                                        }
                                    >
                                        {ACABADOS.map((a) => (
                                            <option key={a} value={a}>
                                                {etiqueta(a)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Prioridad</label>

                                    <select
                                        value={p.prioridad}
                                        onChange={(e) =>
                                            cambiarProducto(i, "prioridad", e.target.value)
                                        }
                                    >
                                        {PRIORIDADES.map((x) => (
                                            <option key={x} value={x}>
                                                {etiqueta(x)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group full-width mt-2">
                                <label>Observaciones para producción</label>

                                <textarea
                                    rows={2}
                                    maxLength={500}
                                    value={p.observaciones}
                                    onChange={(e) =>
                                        cambiarProducto(i, "observaciones", e.target.value)
                                    }
                                    placeholder="Añade detalles o instrucciones específicas..."
                                />
                            </div>

                            {productos.length > 1 && (
                                <button
                                    type="button"
                                    className="btn-link"
                                    onClick={() => quitarProducto(i)}
                                >
                                    Quitar este producto
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn-secondary mt-2"
                        onClick={agregarProducto}
                    >
                        + Agregar otro producto
                    </button>
                </section>

                <aside className="summary-sidebar">
                    <div className="summary-card">
                        <h3>FOLIO</h3>

                        <h2 className="folio-number">
                            {folio || folioEdicion || "Se asigna al registrar"}
                        </h2>

                        <span className={folio ? "badge" : "badge draft"}>
                            {folio
                                ? "Pedido registrado"
                                : editando
                                    ? "Editando pedido"
                                    : "Sin registrar"}
                        </span>
                    </div>

                    {errorCatalogos && (
                        <p className="error-text">{errorCatalogos}</p>
                    )}

                    {error && <p className="error-text">{error}</p>}

                    <div className="action-buttons">
                        {folio ? (
                            <button
                                className="btn-primary"
                                type="button"
                                onClick={() => navigate("/pedidos")}
                            >
                                Ir a pedidos
                            </button>
                        ) : (
                            <button
                                className="btn-primary"
                                type="submit"
                                disabled={enviando || cargando}
                            >
                                {enviando
                                    ? editando
                                        ? "Guardando..."
                                        : "Registrando..."
                                    : editando
                                        ? "Guardar cambios"
                                        : "Registrar pedido"}
                            </button>
                        )}
                    </div>
                </aside>
            </div>
        </form>
    );
};

export default CapturarPedido;