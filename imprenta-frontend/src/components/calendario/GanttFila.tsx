import { useEffect, useRef } from "react";
import type { FilaCronograma } from "../../types/consulta";
import { diasEntre } from "../../utils/calendario";
import "../../styles/ConsultarCronograma.css";

interface GanttFilaProps {
    fila: FilaCronograma;
    primerDia: Date;
    totalDias: number;
    seleccionada: boolean;
    onSeleccionar: (fila: FilaCronograma) => void;
}

const GanttFila = ({ fila, primerDia, totalDias, seleccionada, onSeleccionar }: GanttFilaProps) => {
    const barraRef = useRef<HTMLSpanElement>(null);
    // Las barras se recortan al periodo visible. Las columnas de la cuadrícula empiezan en 1
    const colInicio = Math.max(0, diasEntre(primerDia, fila.inicio));
    const colFin = Math.min(totalDias - 1, diasEntre(primerDia, fila.fin));

    useEffect(() => {
        barraRef.current?.style.setProperty("grid-column", `${colInicio + 1} / ${colFin + 2}`);
    }, [colInicio, colFin]);

    return (
        <button
            type="button"
            className={`cg-fila ${seleccionada ? "is-selected" : ""}`}
            aria-pressed={seleccionada}
            disabled={fila.pedidoId === null}
            onClick={() => onSeleccionar(fila)}
        >
            <span className="cg-fila__titulo">
                <strong>{fila.titulo}</strong>
                <small>{fila.subtitulo}</small>
                {fila.responsable && <small>Encargado: {fila.responsable}</small>}
            </span>
            <span className="cg-pista">
                <span
                    ref={barraRef}
                    className={`cg-barra cg-barra--${fila.estado.toLowerCase()}`}
                    title={fila.etiqueta}
                >
                    {fila.etiqueta}
                </span>
            </span>
        </button>
    );
};

export default GanttFila;
