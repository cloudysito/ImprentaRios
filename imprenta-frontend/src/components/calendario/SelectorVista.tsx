import "../../styles/Consulta.css";

interface Opcion<T extends string> {
    valor: T;
    etiqueta: string;
}

interface SelectorVistaProps<T extends string> {
    opciones: Opcion<T>[];
    valor: T;
    onChange: (valor: T) => void;
    ariaLabel: string;
}

// Interruptor segmentado: "Día | Semana" y "10 días | Mes"
function SelectorVista<T extends string>({ opciones, valor, onChange, ariaLabel }: SelectorVistaProps<T>) {
    return (
        <div className="cons-toggle" role="group" aria-label={ariaLabel}>
            {opciones.map((o) => (
                <button
                    key={o.valor}
                    type="button"
                    aria-pressed={o.valor === valor}
                    className={o.valor === valor ? "is-active" : ""}
                    onClick={() => onChange(o.valor)}
                >
                    {o.etiqueta}
                </button>
            ))}
        </div>
    );
}

export default SelectorVista;
