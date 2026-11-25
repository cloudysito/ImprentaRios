package imprenta.sistema.imprentabackend.pedidos.dtos;

import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;

import java.time.LocalDateTime;

public record PedidoResumenDTO(
        String id,
        String folio,
        String clienteNombre,
        String producto,
        int piezas,
        LocalDateTime fechaEntrega,
        EstadoPedido estado,
        // Entrega ya pasada y el pedido no está terminado, entregado ni cancelado
        boolean vencido,
        int diasAtraso
) {
}
