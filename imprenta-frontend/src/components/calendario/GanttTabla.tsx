import type { FilaCronograma } from "../../types/consulta";
import { esDomingo, mismoDia } from "../../utils/calendario";
import GanttFila from "./GanttFila";
import "../../styles/Consulta.css";
import "../../styles/ConsultarCronograma.css";

interface GanttTablaProps {
    dias: Date[];
    hoy: Date;
    filas: FilaCronograma[];
    seleccionadoId: string | null;
    onSeleccionar: (fila: FilaCronograma) => void;
    cargando: boolean;
    error: string | null;
    rangoInvalido: boolean;
}

const GanttTabla = ({
    dias,
    hoy,
    filas,
    seleccionadoId,
    onSeleccionar,
    cargando,
    error,
    rangoInvalido,
}: GanttTablaProps) => {
    const mensaje = cargando
        ? "Cargando cronograma…"
        : error
          ? error
          : rangoInvalido
            ? "El rango de fechas no es válido: «Hasta» debe ser igual o posterior a «Desde»."
            : filas.length === 0
              ? "No hay actividades en este periodo."
              : null;

    if (mensaje) {
        return <div className={`cg-tabla cons-mensaje ${error ? "is-error" : ""}`}>{mensaje}</div>;
    }

    return (
        <div className="cg-tabla">
            <div className="cg-scroll">
                <div className="cg-diagrama" style={{ ["--dias" as string]: dias.length }}>
                    <div className="cg-cabecera" aria-hidden="true">
                        <span />
                        <span className="cg-dias">
                            {dias.map((d) => (
                                <span
                                    key={d.getTime()}
                                    className={`${mismoDia(d, hoy) ? "is-hoy" : ""} ${esDomingo(d) ? "is-domingo" : ""}`}
                                >
                                    {d.getDate()}
                                </span>
                            ))}
                        </span>
                    </div>

                    {filas.map((f) => (
                        <GanttFila
                            key={f.id}
                            fila={f}
                            primerDia={dias[0]}
                            totalDias={dias.length}
                            seleccionada={f.id === seleccionadoId}
                            onSeleccionar={onSeleccionar}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GanttTabla;
