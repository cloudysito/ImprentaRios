import type { FiltrosCalendario, TipoEvento } from "../../types/consulta";
import "../../styles/ConsultarCalendario.css";

interface CalendarioFiltrosProps {
    filtros: FiltrosCalendario;
    onChange: (tipo: TipoEvento, valor: boolean) => void;
}

const OPCIONES: { tipo: TipoEvento; etiqueta: string }[] = [
    { tipo: "PRODUCCION", etiqueta: "Producción" },
    { tipo: "ENTREGA", etiqueta: "Entregas" },
    { tipo: "MANTENIMIENTO", etiqueta: "Mantenimiento" },
];

const CalendarioFiltros = ({ filtros, onChange }: CalendarioFiltrosProps) => (
    <div className="cc-filtros">
        <span className="cc-filtros__titulo">Mostrar</span>
        {OPCIONES.map(({ tipo, etiqueta }) => (
            <label key={tipo}>
                <input
                    type="checkbox"
                    checked={filtros[tipo]}
                    onChange={(e) => onChange(tipo, e.target.checked)}
                />
                <span className={`cc-punto cc-punto--${tipo.toLowerCase()}`} />
                {etiqueta}
            </label>
        ))}
    </div>
);

export default CalendarioFiltros;
