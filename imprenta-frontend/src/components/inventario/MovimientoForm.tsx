import { useState } from "react";
import { MOTIVOS_MOVIMIENTO, type Insumo, type MovimientoRequest, type TipoMovimiento } from "../../types/inventario";
import { formatNumero } from "../../utils/formato";
import { hoyISO } from "../../utils/fechas";
import { mensajeDeError } from "../../utils/errores";

interface MovimientoFormProps {
  insumos: Insumo[];
  folios: string[];
  onGuardar: (insumoId: string, dto: MovimientoRequest) => Promise<Insumo>;
}

const MovimientoForm = ({ insumos, folios, onGuardar }: MovimientoFormProps) => {
  const [hoy] = useState(hoyISO);
  const [tipo, setTipo] = useState<TipoMovimiento>("ENTRADA");
  const [insumoId, setInsumoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fecha, setFecha] = useState(hoy);
  const [motivo, setMotivo] = useState(MOTIVOS_MOVIMIENTO.ENTRADA[0]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  // En una salida también se puede elegir el pedido que consumió el material
  const motivos =
    tipo === "SALIDA" ? [...MOTIVOS_MOVIMIENTO.SALIDA, ...folios.map((f) => `Pedido ${f}`)] : MOTIVOS_MOVIMIENTO.ENTRADA;

  const cambiarTipo = (nuevo: TipoMovimiento) => {
    setTipo(nuevo);
    setMotivo(MOTIVOS_MOVIMIENTO[nuevo][0]);
    setError(null);
    setExito(null);
  };

  const guardar = async () => {
    const insumo = insumos.find((i) => i.id === insumoId);
    const n = Number(cantidad);

    if (!insumo) return setError("Elige un material");
    if (!Number.isInteger(n) || n <= 0) return setError("La cantidad debe ser un número entero mayor a 0");
    if (!fecha || fecha > hoy) return setError("La fecha no puede ser futura");
    if (tipo === "SALIDA" && n > insumo.cantidadDisponible) {
      return setError(`Solo hay ${formatNumero(insumo.cantidadDisponible)} ${insumo.unidad.toLowerCase()} de ${insumo.nombre}`);
    }

    setGuardando(true);
    setError(null);
    setExito(null);
    try {
      const actualizado = await onGuardar(insumo.id, { tipo, cantidad: n, fecha, motivo });
      setCantidad("");
      setExito(
        `Movimiento guardado. Existencia actual ${formatNumero(actualizado.cantidadDisponible)} ${actualizado.unidad.toLowerCase()}`,
      );
    } catch (err) {
      setError(mensajeDeError(err, "No se pudo guardar el movimiento"));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      className="ui-card stock-movimiento"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void guardar();
      }}
    >
      <span className="ui-eyebrow">Registrar movimiento</span>

      <div className="stock-movimiento__tipo" role="group" aria-label="Tipo de movimiento">
        {(["ENTRADA", "SALIDA"] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tipo === t}
            className={`ui-btn ${tipo === t ? "ui-btn--oscuro" : "ui-btn--contorno"}`}
            onClick={() => cambiarTipo(t)}
          >
            {t === "ENTRADA" ? "Entrada" : "Salida"}
          </button>
        ))}
      </div>

      <label className="ui-campo">
        <span>Material</span>
        <select className="ui-input" value={insumoId} onChange={(e) => setInsumoId(e.target.value)}>
          <option value="" disabled>
            Selecciona un material
          </option>
          {insumos.map((i) => (
            <option key={i.id} value={i.id}>
              {i.nombre}
            </option>
          ))}
        </select>
      </label>

      <div className="ui-grid ui-grid--2">
        <label className="ui-campo">
          <span>Cantidad</span>
          <input
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            className="ui-input"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </label>
        <label className="ui-campo">
          <span>Fecha</span>
          <input type="date" className="ui-input" max={hoy} value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </label>
      </div>

      <label className="ui-campo">
        <span>Motivo o folio relacionado</span>
        <select className="ui-input" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
          {motivos.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="ui-error">{error}</p>}
      {exito && <p className="ui-exito">{exito}</p>}

      <button type="submit" className="ui-btn ui-btn--primario ui-btn--ancho" disabled={guardando}>
        {guardando ? "Guardando…" : "Guardar movimiento"}
      </button>
    </form>
  );
};
export default MovimientoForm;
