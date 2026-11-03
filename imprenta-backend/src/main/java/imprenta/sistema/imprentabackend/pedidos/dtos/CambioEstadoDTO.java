package imprenta.sistema.imprentabackend.pedidos.dtos;

import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoDTO(
        @NotNull(message = "El estado es obligatorio")
        EstadoPedido estado
) {
}
