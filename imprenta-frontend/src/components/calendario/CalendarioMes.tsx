import type { ColumnaDia } from "../../types/consulta";
import { etiquetaHoras, nombreDiaCorto } from "../../utils/calendario";
import "../../styles/ConsultarCalendario.css";

const MAX_EVENTOS_POR_DIA = 3;
const ENCABEZADOS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

interface CalendarioMesProps {
    dias: ColumnaDia[];
    onSeleccionarDia: (dia: Date) => void;
}

const CalendarioMes = ({ dias, onSeleccionarDia }: CalendarioMesProps) => (
    <div className="cc-grilla-scroll">
        <div className="cc-mes">
            {ENCABEZADOS.map((d) => (
                <span key={d} className="cc-mes__encabezado">{d}</span>
            ))}

            {dias.map(({ dia, esHoy, fueraDeMes, eventos }) => {
                const visibles = eventos.slice(0, MAX_EVENTOS_POR_DIA);
                const ocultos = eventos.length - visibles.length;
                const clases = ["cc-mes__dia", esHoy ? "is-hoy" : "", fueraDeMes ? "is-fuera" : ""].join(" ").trim();

                return (
                    <div key={dia.getTime()} className={clases}>
                        <button
                            type="button"
                            className="cc-mes__numero"
                            onClick={() => onSeleccionarDia(dia)}
                            aria-label={`Ver ${nombreDiaCorto(dia)} ${dia.getDate()}`}
                        >
                            {dia.getDate()}
                        </button>

                        {visibles.map((e) => (
                            <span
                                key={`${e.id}-${dia.getTime()}`}
                                className={`cc-mes__evento cc-mes__evento--${e.tipo.toLowerCase()}`}
                                title={[
                                    etiquetaHoras(e.inicio, e.fin),
                                    e.titulo,
                                    e.referencia,
                                    e.responsable,
                                ].filter(Boolean).join(" · ")}
                            >
                                {e.titulo} · {e.referencia}
                            </span>
                        ))}

                        {ocultos > 0 && (
                            <button type="button" className="cc-mes__mas" onClick={() => onSeleccionarDia(dia)}>
                                +{ocultos} más
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
);

export default CalendarioMes;