import { CalendarDays, ChevronDown } from "lucide-react";
import type { FiltroEstadoBarra } from "../../types/consulta";
import "../../styles/ConsultarCronograma.css";

interface GanttFiltrosProps {
    estado: FiltroEstadoBarra;
    onEstado: (estado: FiltroEstadoBarra) => void;
    desde: string;
    onDesde: (valor: string) => void;
    hasta: string;
    onHasta: (valor: string) => void;
}

const ESTATUS: { valor: FiltroEstadoBarra; etiqueta: string }[] = [
    { valor: "TODOS", etiqueta: "Todos los estatus" },
    { valor: "DISENO", etiqueta: "En diseño" },
    { valor: "PRODUCCION", etiqueta: "En producción" },
    { valor: "TERMINADO", etiqueta: "Terminado" },
    { valor: "PARO", etiqueta: "Paro de máquina" },
];

const GanttFiltros = ({ estado, onEstado, desde, onDesde, hasta, onHasta }: GanttFiltrosProps) => (
    <div className="cg-filtros">
        <label className="cg-campo">
            <span>Estatus</span>
            <div className="cg-campo__control cg-campo__control--select">
                <select value={estado} onChange={(e) => onEstado(e.target.value as FiltroEstadoBarra)}>
                    {ESTATUS.map((o) => (
                        <option key={o.valor} value={o.valor}>
                            {o.etiqueta}
                        </option>
                    ))}
                </select>
                <ChevronDown size={16} aria-hidden="true" />
            </div>
        </label>

        <label className="cg-campo">
            <span>Desde</span>
            <div className="cg-campo__control">
                <input type="date" value={desde} max={hasta || undefined} onChange={(e) => onDesde(e.target.value)} />
                <CalendarDays size={16} aria-hidden="true" />
            </div>
        </label>

        <label className="cg-campo">
            <span>Hasta</span>
            <div className="cg-campo__control">
                <input type="date" value={hasta} min={desde || undefined} onChange={(e) => onHasta(e.target.value)} />
                <CalendarDays size={16} aria-hidden="true" />
            </div>
        </label>
    </div>
);

export default GanttFiltros;
