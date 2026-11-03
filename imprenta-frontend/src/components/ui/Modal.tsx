import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import "../../styles/Modal.css";

interface ModalProps {
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
}

/** Ventana encima de la página. Se cierra con Escape o dando clic afuera. */
const Modal = ({ titulo, onCerrar, children }: ModalProps) => {
  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", alPresionar);
    return () => window.removeEventListener("keydown", alPresionar);
  }, [onCerrar]);

  return (
    <div
      className="ui-modal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div className="ui-modal__dialogo" role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="ui-modal__encabezado">
          <h2>{titulo}</h2>
          <button type="button" className="ui-modal__cerrar" onClick={onCerrar} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
export default Modal;
