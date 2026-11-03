import type { MaquinaDetalle } from "../../types/mantenimiento";
import { formatNumero } from "../../utils/formato";
import { diaMesAnio } from "../../utils/fechas";

interface MaquinaEncabezadoProps {
  maquina: MaquinaDetalle;
  anio: number;
  onProgramarAlerta: () => void;
}

const MaquinaEncabezado = ({ maquina: m, anio, onProgramarAlerta }: MaquinaEncabezadoProps) => {
  const datos = [
    m.numeroSerie && `Serie ${m.numeroSerie}`,
    m.anioOperacion && `En operación desde ${m.anioOperacion}`,
    m.responsable && `Responsable ${m.responsable}`,
  ].filter(Boolean);

  return (
    <section className="ui-card maquina-encabezado">
      <div className="maquina-encabezado__top">
        <div>
          <h2 className="maquina-encabezado__nombre">{m.nombre}</h2>
          {datos.length > 0 && <p className="maquina-encabezado__datos">{datos.join(" · ")}</p>}
        </div>
        <button type="button" className="ui-btn ui-btn--contorno" onClick={onProgramarAlerta}>
          Programar alerta
        </button>
      </div>

      <dl className="maquina-encabezado__stats">
        <div>
          <dt className="ui-eyebrow">Último servicio</dt>
          <dd>{m.ultimoServicio ? diaMesAnio(m.ultimoServicio) : "Sin registro"}</dd>
        </div>
        <div>
          <dt className="ui-eyebrow">Periodicidad</dt>
          <dd>Cada {m.periodicidadDias} días</dd>
        </div>
        <div>
          <dt className="ui-eyebrow">Horas de uso</dt>
          <dd>{formatNumero(m.horasUso)} h</dd>
        </div>
        <div>
          <dt className="ui-eyebrow">Servicios en {anio}</dt>
          <dd>{m.serviciosEnAnio}</dd>
        </div>
      </dl>
    </section>
  );
};
export default MaquinaEncabezado;
