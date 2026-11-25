import {useEffect, useRef, useState} from "react";
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
    const formularioRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const cerrarAlHacerClickFuera = (event: PointerEvent) => {
            formularioRef.current
                ?.querySelectorAll<HTMLDetailsElement>(".archivo-dropdown[open]")
                .forEach((dropdown) => {
                    if (!dropdown.contains(event.target as Node)) dropdown.open = false;
                });
        };

        document.addEventListener("pointerdown", cerrarAlHacerClickFuera);
        return () => document.removeEventListener("pointerdown", cerrarAlHacerClickFuera);
    }, []);

    const {
        tipos,
        materiales,
        archivos,
        cargando,
        error: errorCatalogos,
    } = useCatalogosPedido(id);

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
    const [archivosPorProducto, setArchivosPorProducto] = useState<string[][]>([[]]);

    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState("");
    const [folio, setFolio] = useState("");
    // Material que falta: el pedido se registró pero queda pendiente hasta que alcance el inventario
    const [avisosInventario, setAvisosInventario] = useState<string[]>([]);

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

                setConservar({
                    personaSolicita: pedido.personaSolicita,
                    precioAcordado: pedido.precioAcordado,
                });

                const productosPedido = pedido.productos.map((p) => ({
                    ...p,
                    cantidad: String(p.cantidad),
                    observaciones: p.observaciones ?? "",
                }));
                setProductos(productosPedido);
                const archivosPorProductoGuardados = productosPedido.map(
                    (producto) => producto.archivosDisenioIds ?? [],
                );
                const tieneArchivosPorProducto = archivosPorProductoGuardados.some((ids) => ids.length > 0);
                setArchivosPorProducto(
                    tieneArchivosPorProducto
                        ? archivosPorProductoGuardados
                        : [
                            pedido.archivosDisenioIds ?? [],
                            ...productosPedido.slice(1).map(() => []),
                        ],
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
        setArchivosPorProducto((prev) => [...prev, []]);
    };

    const quitarProducto = (i: number) => {
        setProductos((prev) => prev.filter((_, idx) => idx !== i));
        setArchivosPorProducto((prev) => prev.filter((_, idx) => idx !== i));
    };

    const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const REGEX_TELEFONO = /^[0-9+()\s-]{7,15}$/;
    const REGEX_MEDIDA = /^\d+([.,]\d+)?\s*[xX×]\s*\d+([.,]\d+)?(\s*(cm|mm|m|in|pulg))?$/i;

    const validar = (): string | null => {
        if (editando || !clienteExistenteId) {
            const nombre = cliente.nombre.trim();
            if (!nombre) return "Escribe el nombre del cliente";
            if (nombre.length > 100) return "El nombre del cliente no puede superar 100 caracteres";
            if (!cliente.telefono.trim()) return "Escribe un teléfono de contacto";
            if (!REGEX_TELEFONO.test(cliente.telefono.trim())) {
                return "El teléfono no es válido (solo números, de 7 a 15 caracteres)";
            }
            if (!cliente.correo.trim()) return "Escribe el correo electrónico";
            if (!REGEX_CORREO.test(cliente.correo.trim())) return "El correo no es válido";
            if (cliente.correo.trim().length > 100) return "El correo no puede superar 100 caracteres";
        }

        const proyectoNombre = proyecto.nombreProyecto.trim();
        if (proyectoNombre.length < 3) return "El nombre del proyecto debe tener al menos 3 caracteres";
        if (proyectoNombre.length > 150) return "El nombre del proyecto no puede superar 150 caracteres";

        if (!proyecto.fechaEntrega) return "Elige la fecha de entrega";
        if (!editando && new Date(proyecto.fechaEntrega) <= new Date()) {
            return "La fecha de entrega debe ser posterior a este momento";
        }

        if (productos.length === 0) return "Agrega al menos un producto";
        for (let i = 0; i < productos.length; i++) {
            const p = productos[i];
            const n = `Producto ${i + 1}`;
            if (!p.tipoProductoId) return `${n}: Elige el tipo de producto`;
            const cantidad = Number(p.cantidad);
            if (!p.cantidad || !Number.isInteger(cantidad) || cantidad < 1) {
                return `${n}: La cantidad debe ser un número entero mayor a 0`;
            }
            if (!p.materialId) return `${n}: Elige el material`;
            if (!p.medidas.trim()) return `${n}: Escribe la medida final`;
            if (p.medidas.trim().length > 30) return `${n}: La medida no puede superar 30 caracteres`;
            if (!REGEX_MEDIDA.test(p.medidas.trim())) return `${n}: La medida debe verse así: 21.5 x 14 cm`;
            const numeros = p.medidas.match(/\d+([.,]\d+)?/g) ?? [];
            if (numeros.some((x) => Number(x.replace(",", ".")) <= 0)) return `${n}: Las medidas deben ser mayores a 0`;
            if (!p.tinta) return `${n}: Elige las tintas`;
            if (p.observaciones.length > 500) return `${n}: Las observaciones no pueden superar 500 caracteres`;
        }
        return null;
    };

    const enviar = async (e: FormEvent) => {
        e.preventDefault();
        const errorValidacion = validar();
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }
        setError("");
        setEnviando(true);

        try {
            const datosPedido = {
                nombreProyecto: proyecto.nombreProyecto,
                fechaEntrega: proyecto.fechaEntrega,
                productos: productos.map((p, indice) => ({
                    ...p,
                    cantidad: Number(p.cantidad),
                    archivosDisenioIds: archivosPorProducto[indice] ?? [],
                })),
                archivosDisenioIds: [...new Set(archivosPorProducto.flat())],
            };

            // Actualizar un pedido existente.
            if (id) {
                await capturaService.actualizarCliente(clienteId, cliente);

                const actualizado = await capturaService.actualizarPedido(id, {
                    ...datosPedido,
                    clienteId,
                    ...conservar,
                });

                // Si todavía falta material se quedan los avisos en pantalla; si no, se regresa a la lista
                if (actualizado.avisosInventario?.length) {
                    setAvisosInventario(actualizado.avisosInventario);
                    setFolio(folioEdicion);
                    return;
                }
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
            setAvisosInventario(pedido.avisosInventario ?? []);
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
        <form ref={formularioRef} className="capturar-pedido-container" noValidate onSubmit={enviar}>
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
                                Nombre del cliente o razón social:
                            </strong>
                            <p></p>
                            <label>
                                {clienteSeleccionado?.nombre ?? "Cliente seleccionado"}
                            </label>
                            <p></p>
                            <strong>
                                Teléfono de contacto:
                            </strong>
                            <p></p>
                            <span>{clienteSeleccionado?.telefono}</span>
                            <p></p>
                            <strong>
                                Correo electrónico:
                            </strong>
                            <p></p>
                            <p></p>
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
                                                {m.nombre}
                                                {m.gramaje > 0 ? ` (${m.gramaje} g)` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group full-width producto-archivo">
                                <label htmlFor={`archivo-disenio-producto-${i}`}>
                                    Archivo(s) de diseño para este producto
                                </label>
                                {(() => {
                                    const seleccionados = archivosPorProducto[i] ?? [];
                                    const disponibles = archivos.filter((archivo) =>
                                        !archivosPorProducto.some((otros, indice) =>
                                            indice !== i && otros.includes(archivo.id),
                                        ),
                                    );
                                    const actualizarSeleccion = (archivoId: string) => {
                                        setArchivosPorProducto((actuales) =>
                                            actuales.map((actual, indice) => {
                                                if (indice !== i) return actual;
                                                return actual.includes(archivoId)
                                                    ? actual.filter((idArchivo) => idArchivo !== archivoId)
                                                    : [...actual, archivoId];
                                            }),
                                        );
                                    };

                                    return (
                                        <>
                                            <details
                                                className="archivo-dropdown"
                                                id={`archivo-disenio-producto-${i}`}
                                            >
                                                <summary
                                                    className={`archivo-dropdown__trigger${seleccionados.length ? " is-selected" : ""}`}
                                                    aria-label={`Seleccionar archivos de diseño para el producto ${i + 1}`}
                                                    aria-disabled={cargando || Boolean(errorCatalogos)}
                                                    onClick={(e) => {
                                                        if (cargando || errorCatalogos) e.preventDefault();
                                                    }}
                                                >
                                                    <span>
                                                        {seleccionados.length
                                                            ? seleccionados
                                                                .map((archivoId) => {
                                                                    const archivo = archivos.find((item) => item.id === archivoId);
                                                                    return archivo
                                                                        ? `${archivo.nombreArchivo} (v${archivo.version ?? 1})`
                                                                        : "Archivo vinculado";
                                                                })
                                                                .join(", ")
                                                            : cargando
                                                                ? "Cargando archivos..."
                                                                : "Selecciona archivos de diseño"}
                                                    </span>
                                                    <svg viewBox="0 0 20 20" aria-hidden="true">
                                                        <path d="m5 7.5 5 5 5-5"/>
                                                    </svg>
                                                </summary>
                                                <div
                                                    className="archivo-dropdown__opciones"
                                                    role="group"
                                                    aria-label={`Archivos disponibles para el producto ${i + 1}`}
                                                >
                                                    {errorCatalogos ? (
                                                        <p className="archivo-dropdown__mensaje">
                                                            No se pudieron cargar los archivos.
                                                        </p>
                                                    ) : disponibles.length ? (
                                                        disponibles.map((archivo) => (
                                                            <button
                                                                type="button"
                                                                className={`archivo-dropdown__opcion${seleccionados.includes(archivo.id) ? " is-selected" : ""}`}
                                                                key={archivo.id}
                                                                aria-pressed={seleccionados.includes(archivo.id)}
                                                                onClick={() => actualizarSeleccion(archivo.id)}
                                                            >
                                                                <span>
                                                                    {archivo.nombreArchivo}
                                                                    <small>Versión {archivo.version ?? 1}</small>
                                                                </span>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <p className="archivo-dropdown__mensaje">
                                                            {cargando
                                                                ? "Cargando archivos..."
                                                                : "No hay archivos disponibles para este producto."}
                                                        </p>
                                                    )}
                                                    {seleccionados.length > 0 && (
                                                        <button
                                                            type="button"
                                                            className="archivo-dropdown__limpiar"
                                                            onClick={() => setArchivosPorProducto((actuales) =>
                                                                actuales.map((actual, indice) => indice === i ? [] : actual),
                                                            )}
                                                        >
                                                            Quitar archivos seleccionados
                                                        </button>
                                                    )}
                                                </div>
                                            </details>
                                            <small>
                                                {seleccionados.length
                                                    ? `${seleccionados.length} archivo${seleccionados.length === 1 ? "" : "s"} seleccionado${seleccionados.length === 1 ? "" : "s"}`
                                                    : "Los archivos seleccionados en otros productos no aparecerán aquí."}
                                            </small>
                                        </>
                                    );
                                })()}
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
                                ? avisosInventario.length > 0
                                    ? "Pendiente de material"
                                    : editando
                                        ? "Cambios guardados"
                                        : "Pedido registrado"
                                : editando
                                    ? "Editando pedido"
                                    : "Sin registrar"}
                        </span>
                    </div>

                    {avisosInventario.length > 0 && (
                        <div className="aviso-inventario" role="alert">
                            <strong>No hay material suficiente para este pedido</strong>
                            <p>
                                El pedido quedó registrado como pendiente de material y no se descontó nada del
                                inventario. Se liberará solo cuando entre el material que falta:
                            </p>
                            <ul>
                                {avisosInventario.map((aviso) => (
                                    <li key={aviso}>{aviso}</li>
                                ))}
                            </ul>
                        </div>
                    )}

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