package imprenta.sistema.imprentabackend.pedidos.dtos;

import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;

import java.time.LocalDateTime;
import java.util.List;

public record PedidoDetalleDTO(
        String id,
        String folio,
        String clienteNombre,
        String producto,
        int piezas,
        LocalDateTime fechaEntrega,
        EstadoPedido estado,
        boolean vencido,
        int diasAtraso,
        boolean materialDescontado,
        int piezasTerminadas,
        String versionDisenio,
        String asignadoA,
        List<EventoBitacoraDTO> bitacora
) {
}
