import type { ColumnaDia } from "../../types/consulta";
import CalendarioColumnaDia from "./CalendarioColumnaDia";
import "../../styles/ConsultarCalendario.css";

interface CalendarioGrillaProps {
    columnas: ColumnaDia[];
    cargando: boolean;
    error: string | null;
}

const CalendarioGrilla = ({ columnas, cargando, error }: CalendarioGrillaProps) => {
    if (cargando) return <div className="cc-grilla cc-grilla--mensaje">Cargando calendario…</div>;
    if (error) return <div className="cc-grilla cc-grilla--mensaje is-error">{error}</div>;

    return (
        <div className="cc-grilla-scroll">
            <div className="cc-grilla" style={{ ["--columnas" as string]: columnas.length }}>
                {columnas.map((c) => (
                    <CalendarioColumnaDia key={c.dia.getTime()} {...c} />
                ))}
            </div>
        </div>
    );
};

export default CalendarioGrilla;
