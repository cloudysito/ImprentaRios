package imprenta.sistema.imprentabackend.pedidos.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoRequestDTO(
        @NotNull(message = "La fecha de entrega es obligatoria")
        @Future(message = "La fecha de entrega debe ser una fecha futura")
        LocalDateTime fechaEntrega,
        @NotBlank(message = "El nombre del proyecto es obligatorio")
        @Size(min = 3, max = 150)
        String nombreProyecto,
        @NotEmpty(message = "El pedido debe contener al menos un producto")
        @Valid
        List<ProductoRequestDTO> productos,
        @NotBlank(message = "El ID del cliente es obligatorio")
        String clienteId,
        @Size(max = 100)
        String personaSolicita,
        @DecimalMin(value = "0.0", message = "El precio no puede ser negativo")
        BigDecimal precioAcordado,
        String archivoDisenioId
) {}
