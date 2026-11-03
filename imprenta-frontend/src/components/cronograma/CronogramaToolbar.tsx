import { Search } from "lucide-react";
import type { FiltroCronograma } from "../../types/cronograma";
import "../../styles/PedidosToolbar.css";

interface CronogramaToolbarProps {
    busqueda: string;
    onBusquedaChange: (valor: string) => void;
    filtro: FiltroCronograma;
    onFiltroChange: (filtro: FiltroCronograma) => void;
    conteos: Partial<Record<FiltroCronograma, number>>;
}

const FILTROS: { valor: FiltroCronograma; label: string }[] = [
    { valor: "TODOS", label: "Todos" },
    { valor: "SIN_GENERAR", label: "Sin generar" },
    { valor: "GENERADO", label: "Generado" },
];

const CronogramaToolbar = ({
                               busqueda,
                               onBusquedaChange,
                               filtro,
                               onFiltroChange,
                               conteos,
                           }: CronogramaToolbarProps) => (
    <div className="pedidos-toolbar">
        <div className="pedidos-toolbar__top">
            <label className="pedidos-toolbar__search">
                <Search size={16} strokeWidth={1.75} />
                <input
                    type="search"
                    placeholder="Buscar folio o cliente"
                    value={busqueda}
                    onChange={(e) => onBusquedaChange(e.target.value)}
                />
            </label>
        </div>

        <div className="pedidos-toolbar__filtros">
            {FILTROS.map(({ valor, label }) => (
                <button
                    key={valor}
                    type="button"
                    aria-pressed={filtro === valor}
                    className={`pedidos-toolbar__filtro ${filtro === valor ? "is-active" : ""}`}
                    onClick={() => onFiltroChange(valor)}
                >
                    {label} ({conteos[valor] ?? 0})
                </button>
            ))}
        </div>
    </div>
);
export default CronogramaToolbar;