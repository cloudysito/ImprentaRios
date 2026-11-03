import { useState } from "react";
import { TIPO_SERVICIO_LABEL, type ServicioRequest, type TipoServicio } from "../../types/mantenimiento";
import { hoyISO } from "../../utils/fechas";
import { mensajeDeError } from "../../utils/errores";

interface RegistrarServicioFormProps {
  responsable: string | null;
  onGuardar: (dto: ServicioRequest) => Promise<unknown>;
}

/** Se monta con key={id de la máquina} para que el técnico arranque con su responsable. */
const RegistrarServicioForm = ({ responsable, onGuardar }: RegistrarServicioFormProps) => {
  const [hoy] = useState(hoyISO);
  const [tipo, setTipo] = useState<TipoServicio>("PREVENTIVO");
  const [fecha, setFecha] = useState(hoy);
  const [tecnico, setTecnico] = useState(responsable ?? "");
  const [paro, setParo] = useState("");
  const [refacciones, setRefacciones] = useState("");
  const [notas, setNotas] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const guardar = async () => {
    const horas = paro.trim() === "" ? null : Number(paro);
    if (!fecha || fecha > hoy) return setError("Solo se registran servicios ya realizados. Para uno futuro usa Programar alerta");
    if (!tecnico.trim()) return setError("Escribe el técnico responsable");
    if (horas !== null && (Number.isNaN(horas) || horas < 0)) return setError("El paro estimado debe ser 0 o más horas");

    setGuardando(true);
    setError(null);
    setExito(null);
    try {
      await onGuardar({ tipo, fecha, tecnico: tecnico.trim(), paroEstimadoHoras: horas, refacciones, notas });
      setParo("");
      setRefacciones("");
      setNotas("");
      setExito("Servicio guardado en el historial");
    } catch (err) {
      setError(mensajeDeError(err, "No se pudo guardar el servicio"));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      className="ui-card maquina-servicio"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void guardar();
      }}
    >
      <span className="ui-eyebrow">Registrar servicio</span>

      <div className="ui-grid ui-grid--2">
        <label className="ui-campo">
          <span>Tipo de servicio</span>
          <select className="ui-input" value={tipo} onChange={(e) => setTipo(e.target.value as TipoServicio)}>
            {(Object.keys(TIPO_SERVICIO_LABEL) as TipoServicio[]).map((t) => (
              <option key={t} value={t}>
                {TIPO_SERVICIO_LABEL[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="ui-campo">
          <span>Fecha del servicio</span>
          <input type="date" className="ui-input" max={hoy} value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </label>
        <label className="ui-campo">
          <span>Técnico responsable</span>
          <input className="ui-input" value={tecnico} onChange={(e) => setTecnico(e.target.value)} />
        </label>
        <label className="ui-campo">
          <span>Paro estimado</span>
          <span className="ui-sufijo">
            <input
              type="number"
              min={0}
              step={0.5}
              inputMode="decimal"
              className="ui-input"
              value={paro}
              onChange={(e) => setParo(e.target.value)}
            />
            <em>h</em>
          </span>
        </label>
      </div>

      <label className="ui-campo">
        <span>Refacciones utilizadas</span>
        <input className="ui-input" maxLength={300} value={refacciones} onChange={(e) => setRefacciones(e.target.value)} />
      </label>

      <label className="ui-campo">
        <span>Notas técnicas</span>
        <textarea className="ui-input" rows={3} maxLength={1000} value={notas} onChange={(e) => setNotas(e.target.value)} />
      </label>

      {error && <p className="ui-error">{error}</p>}
      {exito && <p className="ui-exito">{exito}</p>}

      <button type="submit" className="ui-btn ui-btn--primario ui-btn--ancho maquina-servicio__guardar" disabled={guardando}>
        {guardando ? "Guardando…" : "Guardar servicio en el historial"}
      </button>
    </form>
  );
};
export default RegistrarServicioForm;
