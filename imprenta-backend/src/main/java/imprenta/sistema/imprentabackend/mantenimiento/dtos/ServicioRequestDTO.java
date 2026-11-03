package imprenta.sistema.imprentabackend.mantenimiento.dtos;

import imprenta.sistema.imprentabackend.mantenimiento.model.TipoServicio;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ServicioRequestDTO(
        @NotNull(message = "El tipo de servicio es obligatorio")
        TipoServicio tipo,
        @NotNull(message = "La fecha del servicio es obligatoria")
        @PastOrPresent(message = "Solo se registran servicios ya realizados. Para uno futuro usa Programar alerta")
        LocalDate fecha,
        @NotBlank(message = "El técnico responsable es obligatorio")
        @Size(max = 80)
        String tecnico,
        @DecimalMin(value = "0", message = "El paro estimado no puede ser negativo")
        Double paroEstimadoHoras,
        @Size(max = 300, message = "Las refacciones no pueden superar los 300 caracteres")
        String refacciones,
        @Size(max = 1000, message = "Las notas no pueden superar los 1000 caracteres")
        String notas
) {
}
