import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegistrarArchivoDiseno.css";
import { registrarArchivoDisenio } from "../services/archivoDisenioService";
import { hoyISO } from "../utils/fechas";
import { mensajeDeError } from "../utils/errores";

const EXTENSIONES_PERMITIDAS = [".pdf", ".jpg", ".jpeg", ".cdr"];
const TAMANO_MAXIMO_MB = 200;

const RegistrarDisenio: React.FC = () => {
  const navigate = useNavigate();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [urlVistaPrevia, setUrlVistaPrevia] = useState<string | null>(null);
  const urlVistaPreviaRef = useRef<string | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [formulario, setFormulario] = useState({
    fechaRecepcion: hoyISO(),
    fechaEntrega: hoyISO(),
    resolucion: 300,
    modoColor: "CMYK",
    sangrado: 3,
    medidaArchivo: "22.1 x 14.6 cm",
    caras: 2,
    prensa: "Offset",
  });

  useEffect(() => () => {
    if (urlVistaPreviaRef.current) URL.revokeObjectURL(urlVistaPreviaRef.current);
  }, []);

  const seleccionarArchivo = (nuevoArchivo: File | null) => {
    if (urlVistaPreviaRef.current) URL.revokeObjectURL(urlVistaPreviaRef.current);
    urlVistaPreviaRef.current = nuevoArchivo ? URL.createObjectURL(nuevoArchivo) : null;
    setUrlVistaPrevia(urlVistaPreviaRef.current);
    setArchivo(nuevoArchivo);
  };

  const actualizar = (campo: keyof typeof formulario, valor: string) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: ["resolucion", "sangrado", "caras"].includes(campo)
        ? Number(valor)
        : valor,
    }));
  };

  const validar = (): string | null => {
    if (!archivo) return "Selecciona un archivo antes de registrar el diseño.";
    const nombre = archivo.name.toLowerCase();
    if (!EXTENSIONES_PERMITIDAS.some((ext) => nombre.endsWith(ext))) {
      return "Formato no permitido. Usa PDF, JPG o CorelDRAW (.cdr).";
    }
    if (archivo.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
      return `El archivo supera el máximo de ${TAMANO_MAXIMO_MB} MB.`;
    }
    if (archivo.name.length > 255) return "El nombre del archivo no puede superar 255 caracteres.";
    if (!formulario.fechaRecepcion) return "Indica la fecha de recepción.";
    if (!formulario.fechaEntrega) return "Indica la fecha de entrega.";
    if (formulario.fechaEntrega < formulario.fechaRecepcion) {
      return "La fecha de entrega no puede ser anterior a la de recepción.";
    }
    if (!formulario.medidaArchivo.trim()) return "Escribe la medida del archivo.";
    if (!Number.isInteger(formulario.sangrado) || formulario.sangrado < 0) {
      return "El sangrado debe ser un número entero, 0 o mayor.";
    }
    return null;
  };

  const punto = archivo ? archivo.name.lastIndexOf(".") : -1;
  const extension = archivo && punto >= 0 ? archivo.name.slice(punto).toLowerCase() : "";
  const puedePrevisualizar = extension === ".pdf" || extension === ".jpg" || extension === ".jpeg";
  const verificaciones: { ok: boolean; texto: string }[] = [
    !archivo
        ? { ok: false, texto: "Aún no seleccionas un archivo" }
        : EXTENSIONES_PERMITIDAS.includes(extension)
            ? { ok: true, texto: `Formato ${extension.slice(1).toUpperCase()} aceptado` }
            : { ok: false, texto: "Formato no permitido (usa PDF, JPG o CorelDRAW)" },
    ...(archivo
        ? [
          archivo.size <= TAMANO_MAXIMO_MB * 1024 * 1024
              ? { ok: true, texto: `Tamaño dentro del límite de ${TAMANO_MAXIMO_MB} MB` }
              : { ok: false, texto: `El archivo supera los ${TAMANO_MAXIMO_MB} MB` },
        ]
        : []),
    formulario.resolucion >= 300
        ? { ok: true, texto: `Resolución de ${formulario.resolucion} dpi` }
        : { ok: false, texto: `Resolución de ${formulario.resolucion} dpi: se recomienda 300 dpi como mínimo` },
    formulario.modoColor === "CMYK"
        ? { ok: true, texto: "Perfil de color CMYK" }
        : { ok: false, texto: "Modo RGB: conviértelo a CMYK para imprimir" },
    formulario.sangrado >= 3
        ? { ok: true, texto: `Sangrado de ${formulario.sangrado} mm` }
        : { ok: false, texto: `Sangrado de ${formulario.sangrado} mm: se recomienda al menos 3 mm` },
    formulario.fechaRecepcion &&
    formulario.fechaEntrega &&
    formulario.fechaEntrega >= formulario.fechaRecepcion
        ? { ok: true, texto: "Fechas de recepción y entrega coherentes" }
        : { ok: false, texto: "Revisa las fechas: la entrega no puede ser anterior a la recepción" },
  ];

  const registrar = async () => {
    const errorValidacion = validar();
    if (errorValidacion) {
      setMensaje(errorValidacion);
      return;
    }
    if (!archivo) return;

    setGuardando(true);
    setMensaje("");
    try {
      await registrarArchivoDisenio({
        ...formulario,
        nombreArchivo: archivo.name,
        version: 1,
      });
      setMensaje("Diseño registrado correctamente. Ya puedes editarlo o registrar una nueva versión en Archivos de diseño.");
    } catch (err) {
      setMensaje(mensajeDeError(err, "No se pudo registrar el diseño."));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="registrar-disenio-container">
      <div className="content-grid">
        <div className="main-column">
          <section className="form-card">
            <div className="section-header">
              <h2>RECEPCIÓN Y ENTREGA</h2>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Fecha de recepción</label>
                <input
                  type="date"
                  name="fechaRecepcion"
                  value={formulario.fechaRecepcion}
                  onChange={(e) => actualizar("fechaRecepcion", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Fecha de entrega estimada</label>
                <input
                  type="date"
                  name="fechaEntrega"
                  value={formulario.fechaEntrega}
                  onChange={(e) => actualizar("fechaEntrega", e.target.value)}
                />
              </div>
            </div>
          </section>
          <section className="form-card">
            <div className="section-header">
              <h2>ARCHIVO DEFINITIVO</h2>
            </div>
            <div className="upload-zone">
              <div className="upload-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <div className="upload-text">
                <strong>
                  Arrastra el archivo o selecciónalo desde tu equipo
                </strong>
                <p>
                  Formatos aceptados PDF, JPG y CorelDRAW (CDR) · Tamaño máximo 200 MB
                </p>
              </div>
              <input
                id="archivo-disenio"
                hidden
                type="file"
                accept=".pdf,.jpg,.jpeg,.cdr"
                onChange={(e) => seleccionarArchivo(e.target.files?.[0] ?? null)}
              />
              <button
                className="btn-secondary outline"
                type="button"
                onClick={() =>
                  document.getElementById("archivo-disenio")?.click()
                }
              >
                Seleccionar archivo
              </button>
            </div>
            <div className="uploaded-file">
              <div className="file-icon-box pdf">{extension ? extension.slice(1).toUpperCase() : "—"}</div>
              <div className="file-info">
                <strong>
                  {archivo?.name ?? "Ningún archivo seleccionado"}
                </strong>
                <span>
                  {archivo
                    ? `${(archivo.size / 1024 / 1024).toFixed(1)} MB · Versión 1`
                    : "Selecciona el archivo definitivo"}
                </span>
              </div>
              <div className="file-status">
                {archivo ? <><span className="status-dot green"></span> Listo para validar</> : "Sin archivo"}
              </div>
            </div>
          </section>
          <section className="form-card">
            <div className="section-header">
              <h2>REQUERIMIENTOS TÉCNICOS DE IMPRESIÓN</h2>
            </div>

            <div className="form-row three-cols">
              <div className="form-group">
                <label>Resolución</label>
                <select
                  name="resolucion"
                  value={formulario.resolucion}
                  onChange={(e) => actualizar("resolucion", e.target.value)}
                >
                  <option value="300">300 dpi</option>
                  <option value="150">150 dpi</option>
                </select>
              </div>
              <div className="form-group">
                <label>Modo de color</label>
                <select
                  name="modoColor"
                  value={formulario.modoColor}
                  onChange={(e) => actualizar("modoColor", e.target.value)}
                >
                  <option value="CMYK">CMYK</option>
                  <option value="RGB">RGB</option>
                </select>
              </div>
              <div className="form-group">
                <label>Sangrado (mm)</label>
                <input
                  type="number"
                  name="sangrado"
                  min={0}
                  step={1}
                  value={formulario.sangrado}
                  onChange={(e) => actualizar("sangrado", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row three-cols">
              <div className="form-group">
                <label>Medida del archivo</label>
                <input
                  type="text"
                  maxLength={50}
                  name="medidaArchivo"
                  value={formulario.medidaArchivo}
                  onChange={(e) => actualizar("medidaArchivo", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Caras a imprimir</label>
                <select
                  name="caras"
                  value={formulario.caras}
                  onChange={(e) => actualizar("caras", e.target.value)}
                >
                  <option value="1">1 cara</option>
                  <option value="2">2 caras</option>
                </select>
              </div>
              <div className="form-group">
                <label>Prensa destino</label>
                <select
                  name="prensa"
                  value={formulario.prensa}
                  onChange={(e) => actualizar("prensa", e.target.value)}
                >
                  <option value="Offset">Offset Heidelberg GTO</option>
                  <option value="Digital">Digital Konica Minolta</option>
                </select>
              </div>
            </div>
          </section>
        </div>
        <aside className="summary-sidebar">
          <div className="summary-card">
            <h3>VISTA PREVIA</h3>
            <div className={`preview-box${extension === ".pdf" ? " preview-box--pdf" : ""}`}>
              {!archivo ? (
                <p>Selecciona un archivo para generar la vista previa.</p>
              ) : extension === ".cdr" ? (
                <p>No se puede generar una vista previa para archivos CDR.</p>
              ) : puedePrevisualizar && urlVistaPrevia && extension === ".pdf" ? (
                <object data={urlVistaPrevia} type="application/pdf" aria-label={`Vista previa de ${archivo.name}`}>
                  <p>
                    No se pudo mostrar el PDF en este navegador.{" "}
                    <a href={urlVistaPrevia} target="_blank" rel="noreferrer">Abrir PDF</a>
                  </p>
                </object>
              ) : puedePrevisualizar && urlVistaPrevia ? (
                <img src={urlVistaPrevia} alt={`Vista previa de ${archivo.name}`} />
              ) : (
                <p>No se puede generar una vista previa para este formato.</p>
              )}
            </div>
          </div>
          <div className="summary-card">
            <h3>VALIDACIÓN AUTOMÁTICA</h3>
            <ul className="validation-list">
              {verificaciones.map((v) => (
                  <li key={v.texto} className={v.ok ? "valid" : "warning"}>
                    <span className={`icon ${v.ok ? "check" : "alert"}`}>{v.ok ? "✓" : "!"}</span>{" "}
                    {v.texto}
                  </li>
              ))}
            </ul>
          </div>
          <div className="summary-card">
            <h3>VERSIONES</h3>
            <p className="history-note">
              Este formulario registra la versión 1 de un diseño nuevo. Para
              editar un archivo o registrar una nueva versión, usa la sección de
              archivos de diseño.
            </p>
            <button
              type="button"
              className="btn-secondary outline"
              onClick={() => navigate("/archivos-de-diseno")}
            >
              Ver archivos de diseño
            </button>
          </div>
          <div className="action-buttons">
            <button
              className="btn-primary"
              type="button"
              onClick={registrar}
              disabled={guardando}
            >
              {guardando ? "Registrando..." : "Registrar diseño"}
            </button>
            {mensaje && <p className="helper-text-centered">{mensaje}</p>}
            <p className="helper-text-centered">
              Revisa el aviso de sangrado antes de registrar
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RegistrarDisenio;
