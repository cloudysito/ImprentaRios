package imprenta.sistema.imprentabackend.pedidos.dtos;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record ArchivoDisenioRequestDTO(
        @NotBlank(message = "El nombre del archivo es obligatorio")
        @Size(max = 255, message = "El nombre del archivo no puede superar 255 caracteres")
        @Pattern(regexp = "(?i).+\\.(pdf|jpe?g|cdr)$",
                message = "Formato no permitido. Usa PDF, JPG o CorelDRAW (.cdr)")
        String nombreArchivo,

        @NotNull(message = "La fecha de recepción es obligatoria")
        LocalDate fechaRecepcion,

        @NotNull(message = "La fecha de entrega es obligatoria")
        LocalDate fechaEntrega,

        @NotNull(message = "La resolución es obligatoria")
        @Min(value = 1, message = "La resolución debe ser mayor que cero")
        Integer resolucion,

        @NotBlank(message = "El modo de color es obligatorio")
        @Size(max = 20, message = "El modo de color no puede superar los 20 caracteres")
        String modoColor,

        @NotNull(message = "El sangrado es obligatorio")
        @Min(value = 0, message = "El sangrado no puede ser negativo")
        Integer sangrado,

        @NotBlank(message = "La medida del archivo es obligatoria")
        @Size(max = 50, message = "La medida del archivo no puede superar los 50 caracteres")
        String medidaArchivo,

        @NotNull(message = "El número de caras es obligatorio")
        @Min(value = 1, message = "El número de caras debe ser mayor que cero")
        Integer caras,

        @NotBlank(message = "El nombre de la prensa es obligatorio")
        @Size(max = 50, message = "El nombre de la prensa no puede superar los 50 caracteres")
        String prensa,

        @NotNull(message = "La versión es obligatoria")
        @Min(value = 1, message = "La versión debe ser mayor que cero")
        Integer version,

        @NotNull(message = "El ID del pedido es obligatorio")
        String grupoId
) {
        @AssertTrue(message = "La fecha de entrega no puede ser anterior a la de recepción")
        public boolean isRangoFechasValido() {
                return fechaRecepcion == null || fechaEntrega == null
                        || !fechaEntrega.isBefore(fechaRecepcion);
        }
}
