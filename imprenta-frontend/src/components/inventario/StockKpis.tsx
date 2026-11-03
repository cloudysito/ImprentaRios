interface StockKpisProps {
  activos: number;
  bajoReorden: number;
  movimientos: number;
  mes: string;
}

const StockKpis = ({ activos, bajoReorden, movimientos, mes }: StockKpisProps) => (
  <div className="stock-kpis">
    <div className="ui-card stock-kpi">
      <span className="ui-eyebrow">Materiales activos</span>
      <strong>{activos}</strong>
    </div>
    <div className={`ui-card stock-kpi ${bajoReorden > 0 ? "stock-kpi--alerta" : ""}`}>
      <span className="ui-eyebrow">Bajo punto de reorden</span>
      <strong>{bajoReorden}</strong>
    </div>
    <div className="ui-card stock-kpi">
      <span className="ui-eyebrow">Movimientos de {mes}</span>
      <strong>{movimientos}</strong>
    </div>
  </div>
);
export default StockKpis;
