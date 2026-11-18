import "../../styles/ConsultarCronograma.css";

const ITEMS = [
    { clase: "diseno", etiqueta: "En diseño" },
    { clase: "produccion", etiqueta: "En producción" },
    { clase: "terminado", etiqueta: "Terminado" },
    { clase: "paro", etiqueta: "Paro de máquina" },
];

const GanttLeyenda = () => (
    <ul className="cg-leyenda">
        {ITEMS.map((i) => (
            <li key={i.clase}>
                <span className={`cg-leyenda__color cg-barra--${i.clase}`} />
                {i.etiqueta}
            </li>
        ))}
    </ul>
);

export default GanttLeyenda;
