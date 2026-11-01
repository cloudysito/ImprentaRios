package imprenta.sistema.imprentabackend.usuarios.dtos;

import imprenta.sistema.imprentabackend.usuarios.model.Rol;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record EmpleadoRequestDTO(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
        String nombre,

        @NotBlank(message = "El usuario es obligatorio")
        @Size(min = 3, max = 50, message = "El usuario debe tener entre 3 y 50 caracteres")
        String usuario,

        @Size(min = 4, max = 100, message = "La contraseña debe tener entre 4 y 100 caracteres")
        String password,

        @NotNull(message = "El rol es obligatorio")
        Rol rol,

        Boolean activo
) {
}
