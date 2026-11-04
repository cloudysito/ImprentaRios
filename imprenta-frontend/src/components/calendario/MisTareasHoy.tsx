import type { TareaHoy } from "../../types/consulta";
import "../../styles/Consulta.css";
import "../../styles/ConsultarCalendario.css";

const MisTareasHoy = ({ tareas }: { tareas: TareaHoy[] }) => (
    <section className="cons-tarjeta">
        <h2 className="cons-tarjeta__titulo">Mis tareas de hoy</h2>
        {tareas.length === 0 ? (
            <p className="cons-vacio">No tienes tareas asignadas para hoy.</p>
        ) : (
            <ul className="cc-tareas">
                {tareas.map((t) => (
                    <li key={t.id} className={`cc-tarea cc-tarea--${t.tipo.toLowerCase()}`}>
                        <strong>{t.titulo}</strong>
                        <span>{t.detalle}</span>
                    </li>
                ))}
            </ul>
        )}
    </section>
);

export default MisTareasHoy;
