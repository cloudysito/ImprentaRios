import AsignacionCard from "../components/taller/AsignacionCard";
import TrabajoEnCurso from "../components/taller/TrabajoEnCurso";
import ReporteAvanceForm from "../components/taller/ReporteAvanceForm";
import { useTaller } from "../hooks/useTaller";
import { horaMinutos } from "../utils/fechas";
import "../styles/UI.css";
import "../styles/VerificarProgreso.css";

const VerificarProgresoPage = () => {
  const taller = useTaller();
  const sel = taller.seleccionada;

  return (
    <div className="taller">
      <section className="taller__lista">
        {taller.inicioTurno && (
          <span className="taller__turno">Turno activo desde las {horaMinutos(taller.inicioTurno)}</span>
        )}
        <span className="ui-eyebrow taller__titulo-lista">Mis asignaciones de hoy</span>

        {taller.cargando ? (
          <p className="ui-vacio">Cargando asignaciones…</p>
        ) : taller.error ? (
          <p className="ui-error">{taller.error}</p>
        ) : taller.asignaciones.length === 0 ? (
          <p className="ui-card ui-vacio">No tienes trabajos asignados para hoy.</p>
        ) : (
          taller.asignaciones.map((a) => (
            <AsignacionCard
              key={a.actividadId}
              asignacion={a}
              seleccionada={sel?.actividadId === a.actividadId}
              onSeleccionar={() => taller.seleccionar(a.actividadId)}
            />
          ))
        )}
      </section>

      <section className="taller__detalle">
        {sel ? (
          <>
            <TrabajoEnCurso asignacion={sel} />
            <ReporteAvanceForm
              key={sel.actividadId}
              asignacion={sel}
              onReportar={(dto) => taller.reportar(sel.actividadId, dto)}
              onTerminar={() => taller.terminar(sel.actividadId)}
            />
          </>
        ) : (
          !taller.cargando && <p className="ui-card ui-vacio">Cuando tengas una asignación, aquí podrás reportar su avance.</p>
        )}
      </section>
    </div>
  );
};
export default VerificarProgresoPage;
