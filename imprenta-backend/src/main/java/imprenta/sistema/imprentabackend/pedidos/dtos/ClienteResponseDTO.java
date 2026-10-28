package imprenta.sistema.imprentabackend.pedidos.dtos;

public record ClienteResponseDTO(
        String id,
        String nombre,
        String telefono,
        String correo
) {
}
