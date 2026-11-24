import { useState } from "react";
import Modal from "../ui/Modal";
import { TIPO_INSUMO_LABEL, type Insumo, type InsumoRequest, type TipoInsumo } from "../../types/inventario";
import { mensajeDeError } from "../../utils/errores";

interface NuevoInsumoModalProps {
  onCerrar: () => void;
  onCrear: (dto: InsumoRequest) => Promise<unknown>;
  insumo?: Insumo;
}

const UNIDADES = ["Pliegos", "Hojas", "Kilos", "Litros", "Rollos", "Piezas"];

const NuevoInsumoModal = ({ onCerrar, onCrear, insumo }: NuevoInsumoModalProps) => {
  const editando = Boolean(insumo);
  const [nombre, setNombre] = useState(insumo?.nombre ?? "");
  const [tipo, setTipo] = useState<TipoInsumo>(insumo?.tipoInsumo ?? "SUSTRATO");
  const [unidad, setUnidad] = useState(insumo?.unidad ?? "Pliegos");
  const [existencia, setExistencia] = useState(String(insumo?.cantidadDisponible ?? 0));
  const [punto, setPunto] = useState(String(insumo?.puntoReorden ?? 0));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardar = async () => {
    const cantidad = Number(existencia);
    const puntoReorden = Number(punto);
    if (!nombre.trim()) return setError("Escribe el nombre del material");
    if (nombre.trim().length > 100) return setError("El nombre no puede superar 100 caracteres");
    if (!unidad.trim()) return setError("Escribe la unidad");
    if (unidad.trim().length > 30) return setError("La unidad no puede superar 30 caracteres");
    if (!Number.isInteger(cantidad) || cantidad < 0) return setError("La existencia debe ser un entero, 0 o mayor");
    if (!Number.isInteger(puntoReorden) || puntoReorden < 0) {
      return setError("El punto de reorden debe ser un entero, 0 o mayor");
    }

    setGuardando(true);
    setError(null);
    try {
      await onCrear({
        nombre: nombre.trim(),
        tipoInsumo: tipo,
        unidad: unidad.trim(),
        cantidadDisponible: cantidad,
        puntoReorden,
      });
      onCerrar();
    } catch (err) {
      setError(mensajeDeError(err, "No se pudo registrar el material"));
      setGuardando(false);
    }
  };

  return (
      <Modal titulo={editando ? "Editar material" : "Nuevo material"} onCerrar={onCerrar}>
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
            <input
                className="ui-input"
                autoFocus
                maxLength={100}
                placeholder="ej. Couché 135 g · 70 x 95 cm"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />
          </label>
          <div className="ui-grid ui-grid--2">
            <label className="ui-campo">
              <span>Tipo</span>
              <select className="ui-input" value={tipo} onChange={(e) => setTipo(e.target.value as TipoInsumo)}>
                {(Object.keys(TIPO_INSUMO_LABEL) as TipoInsumo[]).map((t) => (
                    <option key={t} value={t}>
                      {TIPO_INSUMO_LABEL[t]}
                    </option>
                ))}
              </select>
            </label>
            <label className="ui-campo">
              <span>Unidad</span>
              <input className="ui-input" list="unidades-insumo" maxLength={30} value={unidad} onChange={(e) => setUnidad(e.target.value)} />
              <datalist id="unidades-insumo">
                {UNIDADES.map((u) => (
                    <option key={u} value={u} />
                ))}
              </datalist>
            </label>
          </div>
          <div className="ui-grid ui-grid--2">
            <label className="ui-campo">
              <span>Existencia inicial</span>
              <input type="number" min={0} step={1} className="ui-input" disabled={editando} value={existencia} onChange={(e) => setExistencia(e.target.value)} />
            </label>
            <label className="ui-campo">
              <span>Punto de reorden</span>
              <input type="number" min={0} step={1} className="ui-input" value={punto} onChange={(e) => setPunto(e.target.value)} />
            </label>
          </div>

          {error && <p className="ui-error">{error}</p>}

          <div className="ui-modal__acciones">
            <button type="button" className="ui-btn ui-btn--contorno" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="ui-btn ui-btn--primario" disabled={guardando}>
              {guardando ? "Guardando…" : editando ? "Guardar cambios" : "Registrar material"}
            </button>
          </div>
        </form>
      </Modal>
  );
};
export default NuevoInsumoModal;