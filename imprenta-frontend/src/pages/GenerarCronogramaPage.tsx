import CronogramaToolbar from "../components/cronograma/CronogramaToolbar";
import CronogramaTabla from "../components/cronograma/CronogramaTabla";
import DetalleCronograma from "../components/cronograma/DetalleCronograma";
import { useCronograma } from "../hooks/useCronograma";
import { useDetalleCronograma } from "../hooks/useDetalleCronograma";
import "../styles/GestionarPedidos.css";

const GenerarCronogramaPage = () => {
    const lista = useCronograma();
    const folio = useDetalleCronograma(lista.seleccionadoId);

    const handleGenerar = async (empleadoId: string) => {
        const actualizado = await folio.generar(empleadoId);
        if (actualizado) lista.actualizarEstado(actualizado.id, actualizado.estadoCronograma);
    };

    const handleEliminar = async () => {
        const actualizado = await folio.eliminar();
        if (actualizado) lista.actualizarEstado(actualizado.id, actualizado.estadoCronograma);
    };

    return (
        <div className="gestionar-pedidos">
            <section className="gestionar-pedidos__lista">
                <CronogramaToolbar
                    busqueda={lista.busqueda}
                    onBusquedaChange={lista.setBusqueda}
                    filtro={lista.filtro}
                    onFiltroChange={lista.setFiltro}
                    conteos={lista.conteos}
                />
                <CronogramaTabla
                    items={lista.itemsVisibles}
                    seleccionadoId={lista.seleccionadoId}
                    onSeleccionar={lista.seleccionar}
                    cargando={lista.cargando}
                    error={lista.error}
                />
            </section>

            <DetalleCronograma
                detalle={folio.detalle}
                cargando={folio.cargando}
                guardando={folio.guardando}
                error={folio.error}
                onGenerar={handleGenerar}
                onEliminar={handleEliminar}
            />
        </div>
    );
};
export default GenerarCronogramaPage;