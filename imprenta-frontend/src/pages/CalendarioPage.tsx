import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendario } from '../hooks/useCalendario';
import { formatFechaCorta } from '../utils/formato';
// @ts-ignore
import '../styles/Calendario.css';

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
    } = useCalendario();

    return (
        <div className="calendario-container">
            <div className="calendario-main">
                <div className="calendario-toolbar">
                    <div className="calendario-toolbar__top">
                        <div className="calendario-toggle">
                            <button type="button">Día</button>
                            <button type="button" className="is-active">Semana</button>
                        </div>
                        <div className="calendario-date-nav">
                            <button type="button"><ChevronLeft size={18} /></button>
                            <span>Semana actual</span>
                            <button type="button"><ChevronRight size={18} /></button>
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
                            <span className="filtro-dot dot-mantenimiento"></span> Mantenimiento
                        </label>
                    </div>
                </div>

                <div className="calendario-grid" style={{ minHeight: '300px' }}>
                    {cargando && (
                        <div style={{ gridColumn: 'span 6', padding: '40px', textAlign: 'center', color: '#6f6a63' }}>
                            Cargando cronograma...
                        </div>
                    )}
                    {error && (
                        <div style={{ gridColumn: 'span 6', padding: '40px', textAlign: 'center', color: '#a63d30' }}>
                            {error}
                        </div>
                    )}
                    {!cargando && !error && actividadesVisibles.length === 0 && (
                        <div style={{ gridColumn: 'span 6', padding: '40px', textAlign: 'center', color: '#6f6a63' }}>
                            No hay actividades registradas en este periodo.
                        </div>
                    )}
                    {!cargando && !error && actividadesVisibles.map((act) => {
                        const nombre = act.nombreActividad.toLowerCase();
                        let claseTipo = 'produccion';
                        if (nombre.includes('mantenimiento')) claseTipo = 'mantenimiento';
                        else if (nombre.includes('entrega')) claseTipo = 'entrega';

                        return (
                            <div key={act.id} className={`cal-card ${claseTipo}`}>
                                <strong>{formatFechaCorta(act.fechaHoraInicio)}</strong>
                                <span>{act.nombreActividad}</span>
                                <span style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{act.descripcion}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <aside className="calendario-sidebar">
                <div className="cal-sidebar-card">
                    <h3>Panel Operativo</h3>
                    <p style={{ fontSize: '13px', color: '#6f6a63', lineHeight: 1.5 }}>
                        Gestión sincronizada de turnos, producción y mantenimiento según los registros del backend.
                    </p>
                </div>
                <div className="cal-sidebar-card info">
                    <p className="info-text">
                        <strong>Vista de solo lectura</strong>
                        Cualquier usuario consulta esta pantalla sin alterar los registros del cronograma.
                    </p>
                </div>
            </aside>
        </div>
    );
};

export default CalendarioPage;