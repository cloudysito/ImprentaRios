package imprenta.sistema.imprentabackend.pedidos.mappers;

import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;

public final class PedidoMapper {
    private PedidoMapper() { }

    public static Pedido toEntity(PedidoRequestDTO dto) {
        Pedido pedido = new Pedido();
        actualizarEntidad(pedido, dto);
        return pedido;
    }

    public static void actualizarEntidad(Pedido pedido, PedidoRequestDTO dto) {
        pedido.setFechaEntrega(dto.fechaEntrega());
        pedido.setNombreProyecto(dto.nombreProyecto());
        pedido.setClienteId(dto.clienteId());
        pedido.setProductos(dto.productos().stream().map(ProductoMapper::toEntity).toList());
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