import PedidosToolbar from "../components/pedidos/PedidosToolbar";
import PedidosTabla from "../components/pedidos/PedidosTabla";
import DetalleFolio from "../components/pedidos/DetalleFolio";
import { usePedidos } from "../hooks/usePedidos";
import { useDetallePedido } from "../hooks/useDetallePedido";
<<<<<<< HEAD
// @ts-ignore
import "../styles/GestionarPedidos.css";

const GestionarPedidosPage = () => {
    const lista = usePedidos();
    const folio = useDetallePedido(lista.seleccionadoId);

    const handleMarcarEntregado = async () => {
        const actualizado = await folio.cambiarEstado("ENTREGADO");
        if (actualizado) {
            // la fila de la tabla también cambia su pastilla de estatus
            lista.actualizarEstado(actualizado.id, actualizado.estado);
        }
    };

    const handleCerrarFolio = () => {
        // TODO definir con el equipo qué significa "cerrar folio"
        console.log("Cerrar folio", lista.seleccionadoId);
    };

    return (
        <div className="gestionar-pedidos">
            <section className="gestionar-pedidos__lista">
                <PedidosToolbar
                    busqueda={lista.busqueda}
                    onBusquedaChange={lista.setBusqueda}
                    filtro={lista.filtro}
                    onFiltroChange={lista.setFiltro}
                    conteos={lista.conteos}
                />
                <PedidosTabla
                    pedidos={lista.pedidosVisibles}
                    seleccionadoId={lista.seleccionadoId}
                    onSeleccionar={lista.seleccionar}
                    cargando={lista.cargando}
                    error={lista.error}
                />
            </section>
            <DetalleFolio
                detalle={folio.detalle}
                cargando={folio.cargando}
                guardando={folio.guardando}
                error={folio.error}
                onMarcarEntregado={handleMarcarEntregado}
                onCerrarFolio={handleCerrarFolio}
            />
        </div>
    );
};

export default GestionarPedidosPage;
=======
import "../styles/GestionarPedidos.css";

const GestionarPedidosPage = () => {
  const lista = usePedidos();
  const folio = useDetallePedido(lista.seleccionadoId);

  const handleMarcarEntregado = async () => {
    const actualizado = await folio.cambiarEstado("ENTREGADO");
    if (actualizado) {
      // la fila de la tabla también cambia su pastilla de estatus
      lista.actualizarEstado(actualizado.id, actualizado.estado);
    }
  };

  const handleCerrarFolio = () => {
    // TODO definir con el equipo qué significa "cerrar folio"
    console.log("Cerrar folio", lista.seleccionadoId);
  };

  return (
    <div className="gestionar-pedidos">
      <section className="gestionar-pedidos__lista">
        <PedidosToolbar
          busqueda={lista.busqueda}
          onBusquedaChange={lista.setBusqueda}
          filtro={lista.filtro}
          onFiltroChange={lista.setFiltro}
          conteos={lista.conteos}
        />
        <PedidosTabla
          pedidos={lista.pedidosVisibles}
          seleccionadoId={lista.seleccionadoId}
          onSeleccionar={lista.seleccionar}
          cargando={lista.cargando}
          error={lista.error}
        />
      </section>

      <DetalleFolio
        detalle={folio.detalle}
        cargando={folio.cargando}
        guardando={folio.guardando}
        error={folio.error}
        onMarcarEntregado={handleMarcarEntregado}
        onCerrarFolio={handleCerrarFolio}
      />
    </div>
  );
};
export default GestionarPedidosPage;
>>>>>>> majo-front
