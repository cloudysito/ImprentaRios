package imprenta.sistema.imprentabackend.inventario.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record MaterialRequestDTO(
        @NotBlank
        String nombre,

        @Min(0)
        int gramaje,

        @NotBlank
        String insumoId
) {
}
