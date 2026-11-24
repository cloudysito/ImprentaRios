package imprenta.sistema.imprentabackend.inventario.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MaterialRequestDTO(
        @NotBlank(message = "El nombre del material es obligatorio")
        @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
        String nombre,

        @Min(value = 0, message = "El gramaje no puede ser negativo")
        int gramaje,

        @NotBlank(message = "El insumo es obligatorio")
        String insumoId
) {
}
