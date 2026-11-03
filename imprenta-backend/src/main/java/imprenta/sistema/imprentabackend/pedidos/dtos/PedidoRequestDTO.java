package imprenta.sistema.imprentabackend.pedidos.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.List;

public record PedidoRequestDTO(
        @NotBlank(message = "El folio es obligatorio")
        @Size(max = 20, message = "El folio no puede superar los 20 caracteres")
        String folio,

        @NotNull(message = "La fecha de registro es obligatoria")
        @PastOrPresent(message = "La fecha de registro no puede ser una fecha futura")
        LocalDateTime fechaRegistro,

        @NotNull(message = "La fecha de entrega es obligatoria")
        @Future(message = "La fecha de entrega debe ser una fecha futura")
        LocalDateTime fechaEntrega,

        @NotBlank(message = "El estado del pedido es obligatorio")
        String estado,

        @NotBlank(message = "El nombre del proyecto es obligatorio")
        @Size(min = 3, max = 150, message = "El nombre del proyecto debe tener entre 3 y 150 caracteres")
        String nombreProyecto,

        @NotEmpty(message = "El pedido debe contener al menos un producto")
        @Valid
        List<ProductoRequestDTO> productos,

        @NotBlank(message = "El ID del cliente es obligatorio")
        String clienteId,

        @NotBlank(message = "El ID del empleado es obligatorio")
        String empleadoId
) {
    @AssertTrue(message = "La fecha de entrega debe ser posterior a la fecha de registro")
    public boolean isRangoFechasValido() {
        if (fechaRegistro == null || fechaEntrega == null) {
            return true;
        }
        return fechaEntrega.isAfter(fechaRegistro);
    }
}
