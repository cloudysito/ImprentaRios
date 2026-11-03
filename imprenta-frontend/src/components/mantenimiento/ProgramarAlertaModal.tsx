import { useState } from "react";
import Modal from "../ui/Modal";
import { hoyISO } from "../../utils/fechas";
import { mensajeDeError } from "../../utils/errores";

interface ProgramarAlertaModalProps {
  maquina: string;
  onCerrar: () => void;
  onProgramar: (fechaHora: string) => Promise<unknown>;
}

const ProgramarAlertaModal = ({ maquina, onCerrar, onProgramar }: ProgramarAlertaModalProps) => {
  const [hoy] = useState(hoyISO);
  const [fecha, setFecha] = useState(hoy);
  const [horaServicio, setHoraServicio] = useState("09:00");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardar = async () => {
    if (!fecha || fecha < hoy) return setError("La alerta debe ser para hoy o una fecha futura");
    if (!horaServicio) return setError("Elige la hora del servicio");

    setGuardando(true);
    setError(null);
    try {
      await onProgramar(`${fecha}T${horaServicio}:00`);
      onCerrar();
    } catch (err) {
      setError(mensajeDeError(err, "No se pudo programar la alerta"));
      setGuardando(false);
    }
  };

  return (
    <Modal titulo={`Programar servicio de ${maquina}`} onCerrar={onCerrar}>
      <form
        className="ui-grid"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void guardar();
        }}
      >
        <div className="ui-grid ui-grid--2">
          <label className="ui-campo">
            <span>Fecha</span>
            <input type="date" className="ui-input" min={hoy} value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </label>
          <label className="ui-campo">
            <span>Hora</span>
            <input type="time" className="ui-input" value={horaServicio} onChange={(e) => setHoraServicio(e.target.value)} />
          </label>
        </div>

        {error && <p className="ui-error">{error}</p>}

        <div className="ui-modal__acciones">
          <button type="button" className="ui-btn ui-btn--contorno" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className="ui-btn ui-btn--primario" disabled={guardando}>
            {guardando ? "Guardando…" : "Programar alerta"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default ProgramarAlertaModal;
