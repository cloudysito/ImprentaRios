package imprenta.sistema.imprentabackend.pedidos.dtos;

import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;
import imprenta.sistema.imprentabackend.pedidos.model.Producto;

import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponseDTO(
        String id,
        String folio,
        LocalDateTime fechaRegistro,
        LocalDateTime fechaEntrega,
        EstadoPedido estado,
        String nombreProyecto,
        List<Producto> productos,
        String clienteId,
        String empleadoId
) {
}
