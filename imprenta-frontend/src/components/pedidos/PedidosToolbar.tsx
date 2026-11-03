import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import type { FiltroEstado } from "../../types/pedido";
import "../../styles/PedidosToolbar.css";

interface PedidosToolbarProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  filtro: FiltroEstado;
  onFiltroChange: (filtro: FiltroEstado) => void;
  conteos: Partial<Record<FiltroEstado, number>>;
}

// Las pestañas que se muestran, en orden
const FILTROS: { valor: FiltroEstado; label: string }[] = [
  { valor: "TODOS", label: "Todos" },
  { valor: "EN_DISENIO", label: "En diseño" },
  { valor: "EN_PRODUCCION", label: "En producción" },
  { valor: "TERMINADO", label: "Terminado" },
  { valor: "ENTREGADO", label: "Entregado" },
];

const PedidosToolbar = ({
  busqueda,
  onBusquedaChange,
  filtro,
  onFiltroChange,
  conteos,
}: PedidosToolbarProps) => (
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

      <Link to="/pedidos/nuevo" className="pedidos-toolbar__nuevo">
        Nuevo pedido
      </Link>
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
export default PedidosToolbar;
