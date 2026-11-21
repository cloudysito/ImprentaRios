package imprenta.sistema.imprentabackend.usuarios.service;

import imprenta.sistema.imprentabackend.usuarios.dtos.EmpleadoRequestDTO;
import imprenta.sistema.imprentabackend.usuarios.dtos.EmpleadoResponseDTO;

import java.util.List;

public interface IEmpleadoService {

    EmpleadoResponseDTO agregarEmpleado(EmpleadoRequestDTO dto);
    void eliminarEmpleado(String id, String usuarioActual);
    EmpleadoResponseDTO obtenerEmpleado(String id);
    List<EmpleadoResponseDTO> listarEmpleados();
    EmpleadoResponseDTO actualizarEmpleado(String id, EmpleadoRequestDTO dto, String usuarioActual);
    EmpleadoResponseDTO autenticarEmpleado(String usuario, String password);
}
