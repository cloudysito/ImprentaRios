package imprenta.sistema.imprentabackend.pedidos.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClienteRequestDTO(
     @NotBlank(message = "El nombre es obligatorio")
     @Size(max = 100)
     String nombre,

     @NotBlank(message = "El telefono es obligatorio")
     @Size(max = 15)
     String telefono,
     @Email(message = "El correo no es válido")
     @Size(max = 100)
     String correo
) {
}
