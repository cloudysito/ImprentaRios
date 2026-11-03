package imprenta.sistema.imprentabackend.inventario.dtos;

import imprenta.sistema.imprentabackend.inventario.model.TipoMovimiento;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record MovimientoRequestDTO(
        @NotNull(message = "Indica si es entrada o salida")
        TipoMovimiento tipo,
        @Min(value = 1, message = "La cantidad debe ser mayor a 0")
        int cantidad,
        @NotNull(message = "La fecha es obligatoria")
        @PastOrPresent(message = "La fecha no puede ser futura")
        LocalDate fecha,
        @NotBlank(message = "El motivo es obligatorio")
        @Size(max = 150, message = "El motivo no puede superar los 150 caracteres")
        String motivo
) {
}
