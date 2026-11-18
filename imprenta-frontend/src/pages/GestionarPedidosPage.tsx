import PedidosToolbar from "../components/pedidos/PedidosToolbar";
import PedidosTabla from "../components/pedidos/PedidosTabla";
import DetalleFolio from "../components/pedidos/DetalleFolio";
import { usePedidos } from "../hooks/usePedidos";
import { useDetallePedido } from "../hooks/useDetallePedido";
import { useAuth } from "../hooks/useAuth";
import { pedidosService } from "../services/pedidosService";
import { mensajeDeError } from "../utils/errores";
import type { PedidoResumen } from "../types/pedido";
import "../styles/GestionarPedidos.css";

const GestionarPedidosPage = () => {
  const lista = usePedidos();
  const folio = useDetallePedido(lista.seleccionadoId);
  const { user } = useAuth();
  const esDueno = user?.rol === "DUENO";

  const handleEliminar = async (p: PedidoResumen) => {
    if (!window.confirm(`¿Eliminar el folio ${p.folio}? Esta acción no se puede deshacer y también borra su cronograma.`)) {
      return;
    }
    try {
      await pedidosService.eliminar(p.id);
      lista.quitarPedido(p.id);
    } catch (err) {
      window.alert(mensajeDeError(err, "No se pudo eliminar el pedido"));
    }
  };

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
          onEliminar={esDueno ? handleEliminar : undefined}
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
