import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../styles/ConsultarCalendario.css";

interface CalendarioNavegadorProps {
    etiqueta: string;
    onAnterior: () => void;
    onSiguiente: () => void;
}

const CalendarioNavegador = ({ etiqueta, onAnterior, onSiguiente }: CalendarioNavegadorProps) => (
    <div className="cc-nav">
        <button type="button" onClick={onAnterior} aria-label="Periodo anterior">
            <ChevronLeft size={18} />
        </button>
        <span>{etiqueta}</span>
        <button type="button" onClick={onSiguiente} aria-label="Periodo siguiente">
            <ChevronRight size={18} />
        </button>
    </div>
);

export default CalendarioNavegador;
