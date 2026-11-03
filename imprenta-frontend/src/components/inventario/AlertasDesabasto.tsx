import { AlertCircle } from "lucide-react";
import type { Insumo } from "../../types/inventario";
import { formatNumero } from "../../utils/formato";

const textoAlerta = (i: Insumo) => {
  const cantidad = `${formatNumero(i.cantidadDisponible)} ${i.unidad.toLowerCase()}`;
  return i.estatus === "DESABASTO"
    ? `${i.nombre} tiene ${cantidad}, por debajo de su punto de reorden (${formatNumero(i.puntoReorden)}).`
    : `${i.nombre} está cerca de su punto de reorden. Quedan ${cantidad}.`;
};

const AlertasDesabasto = ({ insumos }: { insumos: Insumo[] }) => {
  if (insumos.length === 0) return null;

  return (
    <section className="stock-alertas" aria-live="polite">
      <h3>
        <AlertCircle size={17} strokeWidth={2} />
        Alertas de desabasto
      </h3>
      {insumos.map((i) => (
        <p key={i.id}>{textoAlerta(i)}</p>
      ))}
    </section>
  );
};
export default AlertasDesabasto;
