package imprenta.sistema.imprentabackend.inventario.dtos;

public record MaterialResponseDTO(
        String id,
        String nombre,
        int gramaje,
        String insumoId
) {
}
