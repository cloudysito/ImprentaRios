package imprenta.sistema.imprentabackend.calendarizacion.dtos;


import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public record ActividadRequestDTO(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100)
        String nombreActividad,

        @Size(max = 500)
        String descripcion,

        @NotNull(message = "La fecha de inicio es obligatoria")
        LocalDateTime fechaHoraInicio,

        @NotNull(message = "La fecha de fin es obligatoria")
        LocalDateTime fechaHoraFin,

        @NotBlank(message = "El pedido es obligatorio")
        String pedidoId,

        @NotBlank(message = "El empleado es obligatorio")
        String empleadoId
) {
    @AssertTrue(message = "La fecha de fin debe ser posterior a la de inicio")
    public boolean isRangoValido() {
        return fechaHoraInicio == null || fechaHoraFin == null
                || fechaHoraFin.isAfter(fechaHoraInicio);
    }
}