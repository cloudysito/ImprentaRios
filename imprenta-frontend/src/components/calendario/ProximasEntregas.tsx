import type { EntregaProxima } from "../../types/consulta";
import "../../styles/Consulta.css";
import "../../styles/ConsultarCalendario.css";

const ProximasEntregas = ({ entregas }: { entregas: EntregaProxima[] }) => (
    <section className="cons-tarjeta">
        <h2 className="cons-tarjeta__titulo">Próximas entregas</h2>
        {entregas.length === 0 ? (
            <p className="cons-vacio">No hay entregas próximas.</p>
        ) : (
            <ul className="cc-entregas">
                {entregas.map((e) => (
                    <li key={e.id}>
                        <span>
                            {e.folio} · {e.cliente}
                        </span>
                        <span>{e.fecha}</span>
                    </li>
                ))}
            </ul>
        )}
    </section>
);

export default ProximasEntregas;
