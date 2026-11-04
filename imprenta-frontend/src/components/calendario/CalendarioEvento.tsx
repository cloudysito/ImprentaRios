import type { EventoCalendario } from "../../types/consulta";
import { etiquetaHoras } from "../../utils/calendario";
import "../../styles/ConsultarCalendario.css";

const CalendarioEvento = ({ evento }: { evento: EventoCalendario }) => (
    <article className={`cc-evento cc-evento--${evento.tipo.toLowerCase()}`}>
        <strong>{etiquetaHoras(evento.inicio, evento.fin)}</strong>
        <span>{evento.titulo}</span>
        <span>{evento.referencia}</span>
    </article>
);

export default CalendarioEvento;
