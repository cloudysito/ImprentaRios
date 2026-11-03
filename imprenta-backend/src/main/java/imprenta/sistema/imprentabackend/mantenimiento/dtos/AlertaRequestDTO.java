package imprenta.sistema.imprentabackend.mantenimiento.dtos;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AlertaRequestDTO(
        @NotNull(message = "La fecha y hora son obligatorias")
        @FutureOrPresent(message = "La alerta debe ser para hoy o una fecha futura")
        LocalDateTime fechaHora
) {
}
