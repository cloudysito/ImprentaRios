import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendario } from "../hooks/useCalendario";
import { aFecha } from "../utils/fechas";
import { diaMesCorto } from "../utils/calendario";
// @ts-ignore
import "../styles/Calendario.css";
import { MensajeError } from "../components/MensajeError.tsx";
import { Cargando } from "../components/Cargando";

const CalendarioPage = () => {
  const {
    actividadesVisibles,
    cargando,
    error,
    filtroProduccion,
    setFiltroProduccion,
    filtroEntregas,
    setFiltroEntregas,
    filtroMantenimiento,
    setFiltroMantenimiento,
    vista,
    setVista,
    etiquetaPeriodo,
    navegar,
  } = useCalendario();

  return (
    <div className="calendario-container">
      <div className="calendario-main">
        <div className="calendario-toolbar">
          <div className="calendario-toolbar__top">
            <div className="calendario-toggle" role="group" aria-label="Vista del calendario">
              <button
                type="button"
                className={vista === "DIA" ? "is-active" : ""}
                aria-pressed={vista === "DIA"}
                onClick={() => setVista("DIA")}
              >
                Día
              </button>
              <button
                type="button"
                className={vista === "SEMANA" ? "is-active" : ""}
                aria-pressed={vista === "SEMANA"}
                onClick={() => setVista("SEMANA")}
              >
                Semana
              </button>
            </div>
            <div className="calendario-date-nav">
              <button type="button" aria-label="Periodo anterior" onClick={() => navegar(-1)}>
                <ChevronLeft size={18} />
              </button>
              <span>{etiquetaPeriodo}</span>
              <button type="button" aria-label="Periodo siguiente" onClick={() => navegar(1)}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="calendario-filtros">
            <span>MOSTRAR</span>
            <label>
              <input
                type="checkbox"
                checked={filtroProduccion}
                onChange={(e) => setFiltroProduccion(e.target.checked)}
              />
              <span className="filtro-dot dot-produccion"></span> Producción
            </label>
            <label>
              <input
                type="checkbox"
                checked={filtroEntregas}
                onChange={(e) => setFiltroEntregas(e.target.checked)}
              />
              <span className="filtro-dot dot-entregas"></span> Entregas
            </label>
            <label>
              <input
                type="checkbox"
                checked={filtroMantenimiento}
                onChange={(e) => setFiltroMantenimiento(e.target.checked)}
              />
              <span className="filtro-dot dot-mantenimiento"></span>{" "}
              Mantenimiento
            </label>
          </div>
        </div>

        <div className="calendario-grid-scroll" role="region" aria-label="Actividades del calendario" tabIndex={0}>
          <div className="calendario-grid calendario-grid--periodo">
            {cargando && (
              <div className="calendario-grid__estado">
                <Cargando />
              </div>
            )}
            {!cargando && error && (
              <div className="calendario-grid__estado calendario-grid__estado--error">
                <MensajeError
                  mensaje={error}
                  onReintentar={() => window.location.reload()}
                />
              </div>
            )}
            {!cargando && !error && actividadesVisibles.length === 0 && (
              <div className="calendario-grid__estado">
                No hay actividades registradas en este periodo.
              </div>
            )}
            {!cargando &&
              !error &&
              actividadesVisibles.map((act) => {
                const nombre = act.nombreActividad.toLowerCase();
                let claseTipo = "produccion";
                if (nombre.includes("mantenimiento")) claseTipo = "mantenimiento";
                else if (nombre.includes("entrega")) claseTipo = "entrega";

                return (
                  <div key={act.id} className={`cal-card ${claseTipo}`}>
                    <strong>{diaMesCorto(aFecha(act.fechaHoraInicio))}</strong>
                    <span>{act.nombreActividad}</span>
                    <span className="cal-card__descripcion">
                      {act.descripcion}
                    </span>
                    <span className="cal-card__responsable">
                      Responsable: {act.empleadoNombre ?? "Sin asignar"}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <aside className="calendario-sidebar">
        <div className="cal-sidebar-card">
          <h3>Panel Operativo</h3>
          <p className="cal-sidebar-card__texto">
            Gestión sincronizada de turnos, producción y mantenimiento según los
            registros del backend.
          </p>
        </div>
        <div className="cal-sidebar-card info">
          <p className="info-text">
            <strong>Vista de solo lectura</strong>
            Cualquier usuario consulta esta pantalla sin alterar los registros
            del cronograma.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default CalendarioPage;
