import type { ResumenDelPeriodo } from "../../types/consulta";
import "../../styles/Consulta.css";

const FILAS: { clave: keyof ResumenDelPeriodo; etiqueta: string }[] = [
    { clave: "pedidosActivos", etiqueta: "Pedidos activos" },
    { clave: "enProduccion", etiqueta: "En producción" },
    { clave: "enDiseno", etiqueta: "En diseño" },
    { clave: "entregasSemana", etiqueta: "Entregas de la semana" },
    { clave: "paros", etiqueta: "Paros programados" },
];

const ResumenPeriodo = ({ resumen }: { resumen: ResumenDelPeriodo }) => (
    <section className="cons-tarjeta">
        <h2 className="cons-tarjeta__titulo">Resumen del periodo</h2>
        <dl className="cons-resumen">
            {FILAS.map(({ clave, etiqueta }) => (
                <div key={clave}>
                    <dt>{etiqueta}</dt>
                    <dd>{resumen[clave]}</dd>
                </div>
            ))}
        </dl>
    </section>
);

export default ResumenPeriodo;
