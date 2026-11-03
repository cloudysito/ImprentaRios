package imprenta.sistema.imprentabackend.pedidos.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClienteRequestDTO(
     @NotBlank(message = "El es obligatorio")
     @Size(max = 100)
     String nombre,

     @NotBlank(message = "El telefono es obligatorio")
     @Size(max = 15)
     String telefono,

     @NotBlank(message = "El correo es obligatorio")
     @Size(max = 100)
     String correo
) {
}
