package imprenta.sistema.imprentabackend.pedidos.dtos;

import imprenta.sistema.imprentabackend.pedidos.model.Prioridad;
import imprenta.sistema.imprentabackend.pedidos.model.TipoAcabado;
import imprenta.sistema.imprentabackend.pedidos.model.TipoTinta;
import jakarta.validation.constraints.*;

public record ProductoRequestDTO(
        @Min(value = 1, message = "La cantidad a producir no debe ser 0")
        int cantidad,

        @NotBlank(message = "Las medidas son obligatorias")
        @Size(max = 30)
        String medidas,

        @NotNull(message = "El tipo de tinta es obligatorio")
        TipoTinta tinta,

        @NotNull(message = "El tipo de acabado es obligatorio")
        TipoAcabado tipoAcabado,

        @NotNull(message = "La prioridad del producto es obligatoria")
        Prioridad prioridad,

        @Size(max = 500)
        String observaciones,

        @NotBlank(message = "El tipo de producto es obligatorio")
        String tipoProductoId,

        @NotBlank(message = "El material es obligatorio")
        String materialId
) {
}
