import type { ColumnaDia } from "../../types/consulta";
import { nombreDiaCorto } from "../../utils/calendario";
import CalendarioEvento from "./CalendarioEvento";
import "../../styles/ConsultarCalendario.css";

const CalendarioColumnaDia = ({ dia, esHoy, eventos }: ColumnaDia) => (
    <section className={`cc-columna ${esHoy ? "is-hoy" : ""}`}>
        <header className="cc-columna__cabecera">
            <span className="cc-columna__dia">{esHoy ? `${nombreDiaCorto(dia)} · HOY` : nombreDiaCorto(dia)}</span>
            <span className="cc-columna__fecha">{dia.getDate()}</span>
        </header>
        <div className="cc-columna__eventos">
            {eventos.length === 0 ? (
                <div className="cc-libre">Día libre</div>
            ) : (
                eventos.map((e) => <CalendarioEvento key={`${e.id}-${dia.getTime()}`} evento={e} />)
            )}
        </div>
    </section>
);

export default CalendarioColumnaDia;
