import { useConsultarCalendario } from "../hooks/useConsultarCalendario";
import SelectorVista from "../components/calendario/SelectorVista";
import CalendarioNavegador from "../components/calendario/CalendarioNavegador";
import CalendarioFiltros from "../components/calendario/CalendarioFiltros";
import CalendarioGrilla from "../components/calendario/CalendarioGrilla";
import MisTareasHoy from "../components/calendario/MisTareasHoy";
import ProximasEntregas from "../components/calendario/ProximasEntregas";
import AvisoSoloConsulta from "../components/calendario/AvisoSoloConsulta";
import type { VistaCalendario } from "../types/consulta";
import "../styles/ConsultarCalendario.css";

const VISTAS: { valor: VistaCalendario; etiqueta: string }[] = [
    { valor: "DIA", etiqueta: "Día" },
    { valor: "SEMANA", etiqueta: "Semana" },
];

const ConsultarCalendario = () => {
    const c = useConsultarCalendario();

    return (
        <div className="cc-pantalla">
            <section className="cc-principal">
                <div className="cc-barra">
                    <SelectorVista opciones={VISTAS} valor={c.vista} onChange={c.setVista} ariaLabel="Vista del calendario" />
                    <CalendarioNavegador
                        etiqueta={c.etiquetaPeriodo}
                        onAnterior={() => c.navegar(-1)}
                        onSiguiente={() => c.navegar(1)}
                    />
                </div>

                <CalendarioFiltros filtros={c.filtros} onChange={c.cambiarFiltro} />
                <CalendarioGrilla columnas={c.columnas} cargando={c.cargando} error={c.error} />
            </section>

            <aside className="cc-lateral">
                <MisTareasHoy tareas={c.tareasHoy} />
                <ProximasEntregas entregas={c.proximasEntregas} />
                <AvisoSoloConsulta texto="Cualquier usuario consulta esta pantalla sin poder alterar los registros del cronograma." />
            </aside>
        </div>
    );
};

export default ConsultarCalendario;
