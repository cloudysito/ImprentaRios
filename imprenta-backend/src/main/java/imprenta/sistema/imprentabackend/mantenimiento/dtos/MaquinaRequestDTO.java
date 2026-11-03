package imprenta.sistema.imprentabackend.mantenimiento.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MaquinaRequestDTO(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 80, message = "El nombre no puede superar los 80 caracteres")
        String nombre,
        @Size(max = 120, message = "La descripción no puede superar los 120 caracteres")
        String descripcion,
        @Size(max = 40, message = "El número de serie no puede superar los 40 caracteres")
        String numeroSerie,
        @Min(value = 1950, message = "El año de operación no es válido")
        @Max(value = 2100, message = "El año de operación no es válido")
        Integer anioOperacion,
        @Size(max = 80, message = "El responsable no puede superar los 80 caracteres")
        String responsable,
        @Min(value = 1, message = "La periodicidad debe ser de al menos 1 día")
        int periodicidadDias,
        @Min(value = 0, message = "Las horas de uso no pueden ser negativas")
        int horasUso
) {
}
