import { useConsultarCronograma } from "../hooks/useConsultarCronograma";
import SelectorVista from "../components/calendario/SelectorVista";
import GanttFiltros from "../components/calendario/GanttFiltros";
import GanttTabla from "../components/calendario/GanttTabla";
import GanttLeyenda from "../components/calendario/GanttLeyenda";
import ResumenPeriodo from "../components/calendario/ResumenPeriodo";
import DetalleSeleccionado from "../components/calendario/DetalleSeleccionado";
import AvisoSoloConsulta from "../components/calendario/AvisoSoloConsulta";
import type { VistaCronograma } from "../types/consulta";
import "../styles/ConsultarCronograma.css";

const VISTAS: { valor: VistaCronograma; etiqueta: string }[] = [
    { valor: "DIEZ_DIAS", etiqueta: "10 días" },
    { valor: "MES", etiqueta: "Mes" },
];

const ConsultarCronograma = () => {
    const c = useConsultarCronograma();

    return (
        <div className="cg-pantalla">
            <section className="cg-principal">
                <div className="cg-barra">
                    <SelectorVista opciones={VISTAS} valor={c.vista} onChange={c.setVista} ariaLabel="Rango del cronograma" />
                    <button type="button" className="cons-boton" onClick={c.exportar} disabled={c.filas.length === 0}>
                        Exportar vista
                    </button>
                </div>

                <GanttFiltros
                    estado={c.estado}
                    onEstado={c.setEstado}
                    desde={c.desde}
                    onDesde={c.setDesde}
                    hasta={c.hasta}
                    onHasta={c.setHasta}
                />

                <GanttTabla
                    dias={c.dias}
                    hoy={c.hoy}
                    filas={c.filas}
                    seleccionadoId={c.seleccionadoId}
                    onSeleccionar={c.seleccionar}
                    cargando={c.cargando}
                    error={c.error}
                    rangoInvalido={c.rangoInvalido}
                />
                <GanttLeyenda />
            </section>

            <aside className="cg-lateral">
                <ResumenPeriodo resumen={c.resumen} />
                <DetalleSeleccionado detalle={c.detalle} cargando={c.cargandoDetalle} />
                <AvisoSoloConsulta texto="Los filtros cambian lo que se muestra, nunca el cronograma publicado por el Dueño." />
            </aside>
        </div>
    );
};

export default ConsultarCronograma;
