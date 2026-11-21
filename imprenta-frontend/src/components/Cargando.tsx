import "../styles/cargando.css";
export function Cargando() {
    return (
        <div className="cargando" role="status" aria-live="polite">
            <div className="cargando__rueda" />
            Cargando…
        </div>
    );
}
