package imprenta.sistema.imprentabackend.usuarios.mapper;

import imprenta.sistema.imprentabackend.usuarios.dtos.EmpleadoResponseDTO;
import imprenta.sistema.imprentabackend.usuarios.model.Empleado;

public final class EmpleadoMapper {
    private EmpleadoMapper() {}

    public static EmpleadoResponseDTO toResponse(Empleado empleado) {
        if (empleado == null) {
            return null;
        }
        return new EmpleadoResponseDTO(
                empleado.getId(),
                empleado.getNombre(),
                empleado.getUsuario(),
                empleado.getRol(),
                empleado.getActivo()
        );
    }
}
