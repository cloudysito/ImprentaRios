package imprenta.sistema.imprentabackend.usuarios.dtos;

import imprenta.sistema.imprentabackend.usuarios.model.Rol;

public record EmpleadoResponseDTO(
        String id,
        String nombre,
        String usuario,
        Rol rol,
        Boolean activo
) {
}
