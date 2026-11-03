package imprenta.sistema.imprentabackend.pedidos.dtos;

import java.time.LocalDateTime;

public record EventoBitacoraDTO(
        LocalDateTime fecha,
        String descripcion
) {
}
