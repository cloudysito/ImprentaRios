package imprenta.sistema.imprentabackend.pedidos.mappers;

import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;

import java.util.Collections;
import java.util.stream.Collectors;

public final class PedidoMapper {
    private PedidoMapper() {}

    public static Pedido toEntity(PedidoRequestDTO dto) {
        Pedido pedido = new Pedido();
        actualizarEntidad(pedido, dto);
        return pedido;
    }

    public static void actualizarEntidad(Pedido pedido, PedidoRequestDTO dto) {
        pedido.setFolio(dto.folio());
        pedido.setFechaRegistro(dto.fechaRegistro());
        pedido.setFechaEntrega(dto.fechaEntrega());
        pedido.setEstado(dto.estado() != null ? EstadoPedido.valueOf(dto.estado()) : null);
        pedido.setNombreProyecto(dto.nombreProyecto());
        pedido.setClienteId(dto.clienteId());
        pedido.setEmpleadoId(dto.empleadoId());
    }

    public static PedidoResponseDTO toResponse(Pedido pedido) {
        if (pedido == null) {
            return null;
        }

        return new PedidoResponseDTO(
                pedido.getId(),
                pedido.getFolio(),
                pedido.getFechaRegistro(),
                pedido.getFechaEntrega(),
                pedido.getEstado(),
                pedido.getNombreProyecto(),
                pedido.getProductos(),
                pedido.getClienteId(),
                pedido.getEmpleadoId()
        );
    }
}
