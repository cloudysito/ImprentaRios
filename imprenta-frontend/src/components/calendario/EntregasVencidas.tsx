import { AlertTriangle } from "lucide-react";
import type { EntregaVencida } from "../../types/consulta";
import "../../styles/Consulta.css";
import "../../styles/ConsultarCalendario.css";

interface EntregasVencidasProps {
    entregas: EntregaVencida[];
    total: number;
}

const diasTexto = (dias: number) => (dias === 1 ? "1 día" : `${dias} días`);

// Alerta de atraso: pedidos que ya debieron entregarse y siguen sin terminar
const EntregasVencidas = ({ entregas, total }: EntregasVencidasProps) => {
    if (entregas.length === 0) return null;

    return (
        <section className="cons-tarjeta cc-vencidas" role="alert">
            <h2 className="cons-tarjeta__titulo">
                <AlertTriangle size={14} /> Pedidos vencidos ({total})
            </h2>
            <ul className="cc-entregas">
                {entregas.map((e) => (
                    <li key={e.id}>
                        <span>
                            {e.folio} · {e.cliente}
                        </span>
                        <span className="cc-vencidas__atraso">hace {diasTexto(e.diasAtraso)}</span>
                    </li>
                ))}
            </ul>
            {total > entregas.length && <p className="cons-vacio">y {total - entregas.length} más.</p>}
        </section>
    );
};

export default EntregasVencidas;
