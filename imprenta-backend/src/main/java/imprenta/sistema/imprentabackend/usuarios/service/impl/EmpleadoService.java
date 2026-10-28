package imprenta.sistema.imprentabackend.usuarios.service.impl;

import imprenta.sistema.imprentabackend.usuarios.model.Empleado;
import imprenta.sistema.imprentabackend.usuarios.repository.EmpleadoRepository;
import imprenta.sistema.imprentabackend.usuarios.service.IEmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpleadoService implements IEmpleadoService {

    private final EmpleadoRepository empleadoRepository;

    @Override
    public Empleado agregarEmpleado(Empleado empleado) {
        if (empleadoRepository.findByUsuario(empleado.getUsuario()) != null) {
            throw new IllegalArgumentException("El nombre de usuario ya está registrado");
        }
        empleado.setActivo(true);
        return empleadoRepository.save(empleado);
    }

    @Override
    public void eliminarEmpleado(String id) {
        if (!empleadoRepository.existsById(id)) {
            throw new IllegalArgumentException("Empleado no encontrado");
        }
        empleadoRepository.deleteById(id);
    }

    @Override
    public Empleado obtenerEmpleado(String id) {
        return empleadoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Empleado no encontrado"));
    }

    @Override
    public List<Empleado> listarEmpleados() {
        return empleadoRepository.findAll();
    }

    @Override
    public Empleado actualizarEmpleado(Empleado empleado, String id) {
        Empleado empleadoExistente = empleadoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Empleado no encontrado"));

        empleadoExistente.setNombre(empleado.getNombre());
        empleadoExistente.setUsuario(empleado.getUsuario());
        empleadoExistente.setPassword(empleado.getPassword());
        empleadoExistente.setRol(empleado.getRol());
        empleadoExistente.setActivo(empleado.getActivo());

        return empleadoRepository.save(empleadoExistente);
    }

    public Empleado autenticarEmpleado(String usuario, String password) {
        Empleado empleado = empleadoRepository.findByUsuario(usuario);
        if (empleado == null || !empleado.getPassword().equals(password)) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }
        if (!empleado.getActivo()) {
            throw new IllegalArgumentException("El usuario está inactivo");
        }
        return empleado;
    }
}