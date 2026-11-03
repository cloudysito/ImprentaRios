import { TIPO_SERVICIO_LABEL, type Servicio } from "../../types/mantenimiento";
import { diaMesAnio } from "../../utils/fechas";

const HistorialTecnico = ({ servicios }: { servicios: Servicio[] }) => (
  <section className="ui-card maquina-historial">
    <span className="ui-eyebrow">Historial técnico</span>
    {servicios.length === 0 ? (
      <p className="maquina-historial__vacio">Todavía no hay servicios registrados.</p>
    ) : (
      <ul>
        {servicios.map((s) => (
          <li key={s.id} className={`maquina-historial__item maquina-historial__item--${s.tipo.toLowerCase()}`}>
            <strong>
              {diaMesAnio(s.fecha)} · {TIPO_SERVICIO_LABEL[s.tipo]}
            </strong>
            <span>{s.notas ?? s.refacciones ?? `Atendió ${s.tecnico}`}</span>
          </li>
        ))}
      </ul>
    )}
  </section>
);
export default HistorialTecnico;
