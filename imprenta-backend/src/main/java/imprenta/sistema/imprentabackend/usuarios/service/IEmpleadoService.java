package imprenta.sistema.imprentabackend.usuarios.service;

import imprenta.sistema.imprentabackend.usuarios.model.Empleado;

import java.util.List;

public interface IEmpleadoService {

    Empleado agregarEmpleado(Empleado empleado) throws Exception;
    void eliminarEmpleado(String id) throws Exception;
    Empleado obtenerEmpleado(String id) throws Exception;
    List<Empleado> listarEmpleados() throws Exception;
    Empleado actualizarEmpleado(Empleado empleado, String id) throws Exception;
    Empleado autenticarEmpleado(String usuario, String password) throws Exception;

}
