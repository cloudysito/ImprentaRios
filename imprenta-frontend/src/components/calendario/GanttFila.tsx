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
    // Las barras se recortan al periodo visible. Las columnas de la cuadrícula empiezan en 1
    const colInicio = Math.max(0, diasEntre(primerDia, fila.inicio));
    const colFin = Math.min(totalDias - 1, diasEntre(primerDia, fila.fin));

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
            </span>
            <span className="cg-pista">
                <span
                    className={`cg-barra cg-barra--${fila.estado.toLowerCase()}`}
                    style={{ gridColumn: `${colInicio + 1} / ${colFin + 2}` }}
                    title={fila.etiqueta}
                >
                    {fila.etiqueta}
                </span>
            </span>
        </button>
    );
};

export default GanttFila;
