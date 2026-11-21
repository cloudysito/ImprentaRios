import { useEffect, useRef } from "react";
import type { ColumnaDia } from "../../types/consulta";
import CalendarioColumnaDia from "./CalendarioColumnaDia";
import "../../styles/ConsultarCalendario.css";
import { Cargando } from "../Cargando";

interface CalendarioGrillaProps {
    columnas: ColumnaDia[];
    cargando: boolean;
    error: string | null;
}

const CalendarioGrilla = ({ columnas, cargando, error }: CalendarioGrillaProps) => {
    const grillaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        grillaRef.current?.style.setProperty("--columnas", String(columnas.length));
    }, [columnas.length]);

    if (cargando) return <div className="cc-grilla cc-grilla--mensaje"><Cargando /></div>;
    if (error) return <div className="cc-grilla cc-grilla--mensaje is-error">{error}</div>;

    return (
        <div className="cc-grilla-scroll">
            <div ref={grillaRef} className="cc-grilla">
                {columnas.map((c) => (
                    <CalendarioColumnaDia key={c.dia.getTime()} {...c} />
                ))}
            </div>
        </div>
    );
};

export default CalendarioGrilla;
