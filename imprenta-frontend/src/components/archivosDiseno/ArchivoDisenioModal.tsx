import { useState } from "react";
import Modal from "../ui/Modal";
import { mensajeDeError } from "../../utils/errores";
import type {
  ArchivoDisenio,
  ArchivoDisenioRequest,
} from "../../types/archivoDisenio";

interface ArchivoDisenioModalProps {
  modo: "editar" | "nuevaVersion";
  archivo: ArchivoDisenio;
  onCerrar: () => void;
  onGuardar: (dto: ArchivoDisenioRequest) => Promise<unknown>;
}

const FORMATO_VALIDO = /\.(pdf|jpe?g|cdr)$/i;

const ArchivoDisenioModal = ({
  modo,
  archivo,
  onCerrar,
  onGuardar,
}: ArchivoDisenioModalProps) => {
  const esNuevaVersion = modo === "nuevaVersion";
  const version = esNuevaVersion ? archivo.version + 1 : archivo.version;
  const grupoId = esNuevaVersion
    ? (archivo.grupoId ?? archivo.id)
    : archivo.grupoId;

  const [formulario, setFormulario] = useState({
    nombreArchivo: archivo.nombreArchivo,
    fechaRecepcion: archivo.fechaRecepcion,
    fechaEntrega: archivo.fechaEntrega,
    resolucion: String(archivo.resolucion),
    modoColor: archivo.modoColor,
    sangrado: String(archivo.sangrado),
    medidaArchivo: archivo.medidaArchivo,
    caras: String(archivo.caras),
    prensa: archivo.prensa,
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizar = (campo: keyof typeof formulario, valor: string) => {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  };

  const validar = (): string | null => {
    const nombre = formulario.nombreArchivo.trim();
    if (!nombre) return "El nombre del archivo es obligatorio.";
    if (nombre.length > 255) {
      return "El nombre del archivo no puede superar 255 caracteres.";
    }
    if (!FORMATO_VALIDO.test(nombre)) {
      return "Formato no permitido. Usa PDF, JPG o CorelDRAW (.cdr).";
    }
    if (!formulario.fechaRecepcion) return "Indica la fecha de recepción.";
    if (!formulario.fechaEntrega) return "Indica la fecha de entrega.";
    if (formulario.fechaEntrega < formulario.fechaRecepcion) {
      return "La fecha de entrega no puede ser anterior a la de recepción.";
    }
    const resolucion = Number(formulario.resolucion);
    if (!Number.isInteger(resolucion) || resolucion < 1) {
      return "La resolución debe ser un entero mayor que cero.";
    }
    const sangrado = Number(formulario.sangrado);
    if (!Number.isInteger(sangrado) || sangrado < 0) {
      return "El sangrado debe ser un entero, 0 o mayor.";
    }
    if (!formulario.medidaArchivo.trim()) {
      return "Escribe la medida del archivo.";
    }
    if (formulario.medidaArchivo.trim().length > 50) {
      return "La medida del archivo no puede superar 50 caracteres.";
    }
    const caras = Number(formulario.caras);
    if (!Number.isInteger(caras) || caras < 1) {
      return "El número de caras debe ser un entero mayor que cero.";
    }
    if (!formulario.prensa.trim()) return "Indica la prensa destino.";
    return null;
  };

  const guardar = async () => {
    const errorValidacion = validar();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setGuardando(true);
    setError(null);
    try {
      await onGuardar({
        nombreArchivo: formulario.nombreArchivo.trim(),
        fechaRecepcion: formulario.fechaRecepcion,
        fechaEntrega: formulario.fechaEntrega,
        resolucion: Number(formulario.resolucion),
        modoColor: formulario.modoColor,
        sangrado: Number(formulario.sangrado),
        medidaArchivo: formulario.medidaArchivo.trim(),
        caras: Number(formulario.caras),
        prensa: formulario.prensa,
        version,
        grupoId,
      });
      onCerrar();
    } catch (err) {
      setError(
        mensajeDeError(err, "No se pudo guardar el archivo de diseño."),
      );
      setGuardando(false);
    }
  };

  return (
    <Modal
      titulo={
        esNuevaVersion
          ? `Nueva versión (v${version})`
          : "Editar archivo de diseño"
      }
      onCerrar={onCerrar}
    >
      <form
        className="ui-grid archivo-modal"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void guardar();
        }}
      >
        {esNuevaVersion && (
          <p className="archivo-modal__nota">
            La versión anterior se conserva en el historial. Ajusta el nombre
            del archivo si cambió.
          </p>
        )}

        <label className="ui-campo">
          <span>Nombre del archivo</span>
          <input
            className="ui-input"
            autoFocus
            maxLength={255}
            placeholder="ej. menu-primavera.pdf"
            value={formulario.nombreArchivo}
            onChange={(e) => actualizar("nombreArchivo", e.target.value)}
          />
        </label>

        <div className="ui-grid ui-grid--2">
          <label className="ui-campo">
            <span>Fecha de recepción</span>
            <input
              type="date"
              className="ui-input"
              value={formulario.fechaRecepcion}
              onChange={(e) => actualizar("fechaRecepcion", e.target.value)}
            />
          </label>
          <label className="ui-campo">
            <span>Fecha de entrega</span>
            <input
              type="date"
              className="ui-input"
              value={formulario.fechaEntrega}
              onChange={(e) => actualizar("fechaEntrega", e.target.value)}
            />
          </label>
        </div>

        <div className="ui-grid ui-grid--3">
          <label className="ui-campo">
            <span>Resolución</span>
            <select
              className="ui-input"
              value={formulario.resolucion}
              onChange={(e) => actualizar("resolucion", e.target.value)}
            >
              <option value="300">300 dpi</option>
              <option value="150">150 dpi</option>
            </select>
          </label>
          <label className="ui-campo">
            <span>Modo de color</span>
            <select
              className="ui-input"
              value={formulario.modoColor}
              onChange={(e) => actualizar("modoColor", e.target.value)}
            >
              <option value="CMYK">CMYK</option>
              <option value="RGB">RGB</option>
            </select>
          </label>
          <label className="ui-campo">
            <span>Sangrado (mm)</span>
            <input
              type="number"
              min={0}
              step={1}
              className="ui-input"
              value={formulario.sangrado}
              onChange={(e) => actualizar("sangrado", e.target.value)}
            />
          </label>
        </div>

        <div className="ui-grid ui-grid--3">
          <label className="ui-campo">
            <span>Medida del archivo</span>
            <input
              className="ui-input"
              maxLength={50}
              placeholder="ej. 22.1 x 14.6 cm"
              value={formulario.medidaArchivo}
              onChange={(e) => actualizar("medidaArchivo", e.target.value)}
            />
          </label>
          <label className="ui-campo">
            <span>Caras a imprimir</span>
            <select
              className="ui-input"
              value={formulario.caras}
              onChange={(e) => actualizar("caras", e.target.value)}
            >
              <option value="1">1 cara</option>
              <option value="2">2 caras</option>
            </select>
          </label>
          <label className="ui-campo">
            <span>Prensa destino</span>
            <select
              className="ui-input"
              value={formulario.prensa}
              onChange={(e) => actualizar("prensa", e.target.value)}
            >
              <option value="Offset">Offset Heidelberg GTO</option>
              <option value="Digital">Digital Konica Minolta</option>
            </select>
          </label>
        </div>

        {error && <p className="ui-error">{error}</p>}

        <div className="ui-modal__acciones">
          <button
            type="button"
            className="ui-btn ui-btn--contorno"
            onClick={onCerrar}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="ui-btn ui-btn--primario"
            disabled={guardando}
          >
            {guardando
              ? "Guardando…"
              : esNuevaVersion
                ? "Crear versión"
                : "Guardar cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ArchivoDisenioModal;
