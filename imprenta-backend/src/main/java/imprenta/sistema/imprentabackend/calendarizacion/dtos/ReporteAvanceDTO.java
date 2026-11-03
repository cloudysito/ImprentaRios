package imprenta.sistema.imprentabackend.calendarizacion.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record ReporteAvanceDTO(
        @Min(value = 0, message = "Las piezas terminadas no pueden ser negativas")
        int piezasTerminadas,
        @Min(value = 0, message = "La merma no puede ser negativa")
        int merma,
        @Size(max = 100, message = "El motivo de merma no puede superar los 100 caracteres")
        String motivoMerma,
        @Size(max = 500, message = "Las observaciones no pueden superar los 500 caracteres")
        String observaciones
) {
}
