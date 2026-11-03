import { useState } from "react";
import Modal from "../ui/Modal";
import type { MaquinaRequest } from "../../types/mantenimiento";
import { mensajeDeError } from "../../utils/errores";

interface NuevaMaquinaModalProps {
  onCerrar: () => void;
  onCrear: (dto: MaquinaRequest) => Promise<unknown>;
}

const NuevaMaquinaModal = ({ onCerrar, onCrear }: NuevaMaquinaModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [anio, setAnio] = useState("");
  const [responsable, setResponsable] = useState("");
  const [periodicidad, setPeriodicidad] = useState("30");
  const [horas, setHoras] = useState("0");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardar = async () => {
    const nAnio = anio.trim() === "" ? null : Number(anio);
    const nPeriodicidad = Number(periodicidad);
    const nHoras = Number(horas);
    if (!nombre.trim()) return setError("Escribe el nombre de la máquina");
    if (nAnio !== null && (!Number.isInteger(nAnio) || nAnio < 1950 || nAnio > 2100)) return setError("El año no es válido");
    if (!Number.isInteger(nPeriodicidad) || nPeriodicidad < 1) return setError("La periodicidad debe ser de al menos 1 día");
    if (!Number.isInteger(nHoras) || nHoras < 0) return setError("Las horas de uso deben ser un entero, 0 o mayor");

    setGuardando(true);
    setError(null);
    try {
      await onCrear({
        nombre: nombre.trim(),
        descripcion,
        numeroSerie,
        anioOperacion: nAnio,
        responsable,
        periodicidadDias: nPeriodicidad,
        horasUso: nHoras,
      });
      onCerrar();
    } catch (err) {
      setError(mensajeDeError(err, "No se pudo registrar la máquina"));
      setGuardando(false);
    }
  };

  return (
    <Modal titulo="Nueva máquina" onCerrar={onCerrar}>
      <form
        className="ui-grid"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void guardar();
        }}
      >
        <label className="ui-campo">
          <span>Nombre</span>
          <input className="ui-input" autoFocus placeholder="ej. Heidelberg GTO 52" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <label className="ui-campo">
          <span>Descripción</span>
          <input className="ui-input" placeholder="ej. Prensa offset · 4 cuerpos" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </label>
        <div className="ui-grid ui-grid--2">
          <label className="ui-campo">
            <span>Número de serie</span>
            <input className="ui-input" value={numeroSerie} onChange={(e) => setNumeroSerie(e.target.value)} />
          </label>
          <label className="ui-campo">
            <span>En operación desde (año)</span>
            <input type="number" className="ui-input" min={1950} max={2100} value={anio} onChange={(e) => setAnio(e.target.value)} />
          </label>
        </div>
        <label className="ui-campo">
          <span>Responsable</span>
          <input className="ui-input" value={responsable} onChange={(e) => setResponsable(e.target.value)} />
        </label>
        <div className="ui-grid ui-grid--2">
          <label className="ui-campo">
            <span>Servicio preventivo cada</span>
            <span className="ui-sufijo">
              <input type="number" min={1} step={1} className="ui-input" value={periodicidad} onChange={(e) => setPeriodicidad(e.target.value)} />
              <em>días</em>
            </span>
          </label>
          <label className="ui-campo">
            <span>Horas de uso</span>
            <input type="number" min={0} step={1} className="ui-input" value={horas} onChange={(e) => setHoras(e.target.value)} />
          </label>
        </div>

        {error && <p className="ui-error">{error}</p>}

        <div className="ui-modal__acciones">
          <button type="button" className="ui-btn ui-btn--contorno" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className="ui-btn ui-btn--primario" disabled={guardando}>
            {guardando ? "Guardando…" : "Registrar máquina"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default NuevaMaquinaModal;
