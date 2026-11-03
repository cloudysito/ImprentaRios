import { useState } from "react";
import { MOTIVOS_MERMA, type Asignacion, type ReporteAvance } from "../../types/taller";
import { formatNumero } from "../../utils/formato";
import { mensajeDeError } from "../../utils/errores";

interface ReporteAvanceFormProps {
  asignacion: Asignacion;
  onReportar: (dto: ReporteAvance) => Promise<unknown>;
  onTerminar: () => Promise<unknown>;
}

/** Se monta con key={actividadId}, así sus campos arrancan con lo último reportado. */
const ReporteAvanceForm = ({ asignacion: a, onReportar, onTerminar }: ReporteAvanceFormProps) => {
  const [piezas, setPiezas] = useState(String(a.piezasTerminadas));
  const [merma, setMerma] = useState(String(a.merma));
  const [motivo, setMotivo] = useState(a.motivoMerma ?? "");
  const [observaciones, setObservaciones] = useState(a.observaciones ?? "");
  const [enviando, setEnviando] = useState<"reporte" | "terminar" | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const bloqueado = a.terminada || enviando !== null;

  const reportar = async () => {
    const nPiezas = Number(piezas);
    const nMerma = Number(merma);
    if (!Number.isInteger(nPiezas) || nPiezas < 0) return setError("Las piezas terminadas deben ser un entero, 0 o mayor");
    if (nPiezas > a.piezas) return setError(`El pedido es de ${formatNumero(a.piezas)} piezas, no puedes reportar más`);
    if (!Number.isInteger(nMerma) || nMerma < 0) return setError("La merma debe ser un entero, 0 o mayor");
    if (nMerma > 0 && !motivo) return setError("Elige el motivo de la merma");

    setEnviando("reporte");
    setError(null);
    setExito(null);
    try {
      await onReportar({
        piezasTerminadas: nPiezas,
        merma: nMerma,
        motivoMerma: nMerma > 0 ? motivo : null,
        observaciones: observaciones.trim() || null,
      });
      setExito("Avance guardado");
    } catch (err) {
      setError(mensajeDeError(err, "No se pudo guardar el avance"));
    } finally {
      setEnviando(null);
    }
  };

  const terminar = async () => {
    setEnviando("terminar");
    setError(null);
    setExito(null);
    try {
      await onTerminar();
    } catch (err) {
      setError(mensajeDeError(err, "No se pudo marcar como terminado"));
      setEnviando(null);
      setConfirmando(false);
    }
  };

  return (
    <form
      className="ui-card taller-reporte"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void reportar();
      }}
    >
      <span className="ui-eyebrow">Reportar avance y merma</span>

      <div className="ui-grid ui-grid--3">
        <label className="ui-campo">
          <span>Piezas terminadas acumuladas</span>
          <input
            type="number"
            min={0}
            max={a.piezas}
            step={1}
            inputMode="numeric"
            className="ui-input"
            disabled={bloqueado}
            value={piezas}
            onChange={(e) => setPiezas(e.target.value)}
          />
        </label>
        <label className="ui-campo">
          <span>Merma registrada (piezas)</span>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            className="ui-input"
            disabled={bloqueado}
            value={merma}
            onChange={(e) => setMerma(e.target.value)}
          />
        </label>
        <label className="ui-campo">
          <span>Motivo de la merma</span>
          <select className="ui-input" disabled={bloqueado} value={motivo} onChange={(e) => setMotivo(e.target.value)}>
            <option value="">Sin merma</option>
            {MOTIVOS_MERMA.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="ui-campo">
        <span>Observaciones del turno</span>
        <textarea
          className="ui-input"
          rows={2}
          maxLength={500}
          disabled={bloqueado}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </label>

      {a.terminada && <p className="ui-exito">Este trabajo ya se marcó como terminado.</p>}
      {error && <p className="ui-error">{error}</p>}
      {exito && <p className="ui-exito">{exito}</p>}

      {!a.terminada && (
        <div className="taller-reporte__acciones">
          <button type="submit" className="ui-btn ui-btn--primario" disabled={bloqueado}>
            {enviando === "reporte" ? "Guardando…" : "Reportar avance"}
          </button>

          {confirmando ? (
            <>
              <button type="button" className="ui-btn ui-btn--verde" disabled={bloqueado} onClick={() => void terminar()}>
                {enviando === "terminar" ? "Guardando…" : "Sí, marcar como terminado"}
              </button>
              <button type="button" className="ui-btn ui-btn--contorno" disabled={bloqueado} onClick={() => setConfirmando(false)}>
                Cancelar
              </button>
            </>
          ) : (
            <button type="button" className="ui-btn ui-btn--verde" disabled={bloqueado} onClick={() => setConfirmando(true)}>
              Marcar trabajo como terminado
            </button>
          )}
        </div>
      )}
    </form>
  );
};
export default ReporteAvanceForm;
