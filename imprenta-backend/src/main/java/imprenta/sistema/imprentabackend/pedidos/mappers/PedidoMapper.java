package imprenta.sistema.imprentabackend.pedidos.mappers;

import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;

import java.util.List;
import java.util.Objects;

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
        pedido.setPersonaSolicita(dto.personaSolicita());
        pedido.setPrecioAcordado(dto.precioAcordado());
        List<String> archivosPorProducto = dto.productos().stream()
                .flatMap(producto -> producto.archivosDisenioIds() == null
                        ? java.util.stream.Stream.empty()
                        : producto.archivosDisenioIds().stream())
                .toList();
        pedido.setArchivosDisenioIds(limpiar(java.util.stream.Stream.concat(
                dto.archivosDisenioIds() == null ? java.util.stream.Stream.empty() : dto.archivosDisenioIds().stream(),
                archivosPorProducto.stream()
        ).toList()));
        pedido.setArchivoDisenioId(null);
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
                pedido.getEmpleadoId(),
                pedido.getPersonaSolicita(),
                pedido.getPrecioAcordado(),
                archivosDe(pedido)
        );
    }

    // Archivos de diseño del pedido; si es un pedido viejo, usa el campo anterior
    public static List<String> archivosDe(Pedido pedido) {
        if (pedido.getArchivosDisenioIds() != null && !pedido.getArchivosDisenioIds().isEmpty()) {
            return pedido.getArchivosDisenioIds();
        }
        String viejo = pedido.getArchivoDisenioId();
        return viejo == null || viejo.isBlank() ? List.of() : List.of(viejo);
    }

    // Quita vacíos y repetidos
    private static List<String> limpiar(List<String> ids) {
        if (ids == null) {
            return List.of();
        }
        return ids.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(id -> !id.isEmpty())
                .distinct()
                .toList();
    }
}