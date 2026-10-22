package imprenta.sistema.imprentabackend.usuarios.service.impl;


import imprenta.sistema.imprentabackend.usuarios.model.Empleado;
import imprenta.sistema.imprentabackend.usuarios.repository.EmpleadoRepository;
import imprenta.sistema.imprentabackend.usuarios.service.IEmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpleadoService implements IEmpleadoService {

    private final EmpleadoRepository empleadoRepository;

    @Override
    public Empleado agregarEmpleado(Empleado empleado, String id) throws Exception {
        if (empleadoRepository.existsById(String.valueOf(id))) {
            throw new Exception("Empleado ya existe");
        }
        return empleadoRepository.save(empleado);
    }

    @Override
    public void eliminarEmpleado(String id) throws Exception {
        if (!empleadoRepository.existsById(String.valueOf(id))) {
            throw new Exception("Empleado no encontrado");
        }
        System.out.println("Empleado eliminado");
        empleadoRepository.deleteById(String.valueOf(id));
    }

    @Override
    public Empleado obtenerEmpleado(String id) throws Exception {
        if (!empleadoRepository.existsById(String.valueOf(id))) {
            throw new Exception("Empleado no encontrado");
        }
        System.out.println("Empleado encontrado");
        return empleadoRepository.findById(String.valueOf(id)).orElse(null);
    }

    @Override
    public List<Empleado> listarEmpleados() throws Exception {
        return empleadoRepository.findAll();
    }

    @Override
    public Empleado actualizarEmpleado(Empleado empleado, String id) throws Exception {
        if (!empleadoRepository.existsById(String.valueOf(id))) {
            throw new Exception("Empleado no encontrado");
        }
        empleado.setPassword(empleado.getPassword());
        empleado.setActivo(empleado.getActivo());
        return empleadoRepository.save(empleado);
    }
}
