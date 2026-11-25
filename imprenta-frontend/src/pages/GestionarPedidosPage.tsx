import { useState } from "react";
import PedidosToolbar from "../components/pedidos/PedidosToolbar";
import PedidosTabla from "../components/pedidos/PedidosTabla";
import AlertaAtrasos from "../components/pedidos/AlertaAtrasos";
import DetalleFolio from "../components/pedidos/DetalleFolio";
import Modal from "../components/ui/Modal";
import { usePedidos } from "../hooks/usePedidos";
import { useDetallePedido } from "../hooks/useDetallePedido";
import { useAuth } from "../context/AuthContext";
import { pedidosService } from "../services/pedidosService";
import { mensajeDeError } from "../utils/errores";
import type { PedidoResumen } from "../types/pedido";
import "../styles/UI.css";
import "../styles/GestionarPedidos.css";

const GestionarPedidosPage = () => {
  const lista = usePedidos();
  const folio = useDetallePedido(lista.seleccionadoId);
  const { user } = useAuth();
  const esDueno = user?.rol === "DUENO";
  const [pedidoPorCancelar, setPedidoPorCancelar] = useState<PedidoResumen | null>(null);

  const handleEliminar = async (p: PedidoResumen) => {
    if (
      !window.confirm(
        `¿Eliminar el folio ${p.folio}? Esta acción no se puede deshacer y también borra su cronograma.`,
      )
    ) {
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

  const handleCancelarPedido = async () => {
    if (!lista.seleccionadoId) return;
    const pedido = lista.pedidosVisibles.find((p) => p.id === lista.seleccionadoId);
    if (pedido) setPedidoPorCancelar(pedido);
  };

  const confirmarCancelacion = async () => {
    if (!pedidoPorCancelar || folio.detalle?.id !== pedidoPorCancelar.id) return;
    const actualizado = await folio.cambiarEstado("CANCELADO");
    if (actualizado) {
      lista.actualizarEstado(actualizado.id, actualizado.estado);
      setPedidoPorCancelar(null);
    }
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
        <AlertaAtrasos
          total={lista.totalVencidos}
          activo={lista.soloVencidos}
          onAlternar={lista.alternarSoloVencidos}
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
        onReintentar={folio.reintentar}
        onMarcarEntregado={handleMarcarEntregado}
        onCancelarPedido={handleCancelarPedido}
      />
      {pedidoPorCancelar && (
        <Modal titulo="Cancelar pedido" onCerrar={() => setPedidoPorCancelar(null)}>
          <p>
            ¿Confirmas la cancelación del folio <strong>{pedidoPorCancelar.folio}</strong>?
            El pedido se conservará en el sistema con estatus cancelado.
          </p>
          {folio.detalle?.id === pedidoPorCancelar.id && folio.error && (
            <p className="ui-error">{folio.error}</p>
          )}
          <div className="ui-modal__acciones">
            <button
              type="button"
              className="ui-btn ui-btn--contorno"
              onClick={() => setPedidoPorCancelar(null)}
              disabled={folio.guardando}
            >
              Volver
            </button>
            <button
              type="button"
              className="ui-btn ui-btn--primario"
              onClick={() => void confirmarCancelacion()}
              disabled={folio.guardando || folio.cargando || folio.detalle?.id !== pedidoPorCancelar.id}
            >
              {folio.guardando ? "Cancelando…" : "Sí, cancelar pedido"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default GestionarPedidosPage;
