package imprenta.sistema.imprentabackend.auth.dto;

import imprenta.sistema.imprentabackend.usuarios.dtos.EmpleadoResponseDTO;

public record LoginResponse(
        String token,
        EmpleadoResponseDTO empleado
) {
}
