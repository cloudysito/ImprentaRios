import { useEffect, useRef } from "react";
import type { ColumnaDia, VistaCalendario } from "../../types/consulta";
import CalendarioColumnaDia from "./CalendarioColumnaDia";
import CalendarioMes from "./CalendarioMes";
import "../../styles/ConsultarCalendario.css";
import { Cargando } from "../Cargando";

interface CalendarioGrillaProps {
    vista: VistaCalendario;
    columnas: ColumnaDia[];
    onSeleccionarDia: (dia: Date) => void;
    cargando: boolean;
    error: string | null;
}

const CalendarioGrilla = ({ vista, columnas, onSeleccionarDia, cargando, error }: CalendarioGrillaProps) => {
    const grillaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        grillaRef.current?.style.setProperty("--columnas", String(columnas.length));
    }, [columnas.length]);

    if (cargando) return <div className="cc-grilla cc-grilla--mensaje"><Cargando /></div>;
    if (error) return <div className="cc-grilla cc-grilla--mensaje is-error">{error}</div>;
    if (vista === "MES") return <CalendarioMes dias={columnas} onSeleccionarDia={onSeleccionarDia} />;

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
