package imprenta.sistema.imprentabackend.usuarios.service.impl;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.usuarios.dtos.EmpleadoRequestDTO;
import imprenta.sistema.imprentabackend.usuarios.dtos.EmpleadoResponseDTO;
import imprenta.sistema.imprentabackend.usuarios.mapper.EmpleadoMapper;
import imprenta.sistema.imprentabackend.usuarios.model.Empleado;
import imprenta.sistema.imprentabackend.usuarios.model.Rol;
import imprenta.sistema.imprentabackend.usuarios.repository.EmpleadoRepository;
import imprenta.sistema.imprentabackend.usuarios.service.IEmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpleadoService implements IEmpleadoService {
    private final EmpleadoRepository empleadoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public EmpleadoResponseDTO agregarEmpleado(EmpleadoRequestDTO dto) {
        if (dto.password() == null || dto.password().isBlank()) {
            throw new NegocioException(CodigoError.PASSWORD_REQUERIDA);
        }
        if (empleadoRepository.existsByUsuario(dto.usuario())) {
            throw new NegocioException(CodigoError.USUARIO_YA_REGISTRADO);
        }

        Empleado empleado = new Empleado();
        empleado.setNombre(dto.nombre());
        empleado.setUsuario(dto.usuario());
        empleado.setPassword(passwordEncoder.encode(dto.password()));
        empleado.setRol(dto.rol());
        empleado.setActivo(true);

        return EmpleadoMapper.toResponse(guardar(empleado));
    }

    @Override
    public void eliminarEmpleado(String id, String solicitanteId) {
        Empleado empleado = buscarPorId(id);

        if (empleado.getId().equals(solicitanteId)) {
            throw new NegocioException(CodigoError.NO_PUEDES_ELIMINARTE);
        }
        if (esUltimoDuenoActivo(empleado)) {
            throw new NegocioException(CodigoError.ULTIMO_DUENO);
        }

        empleado.setActivo(false);
        guardar(empleado);
    }

    @Override
    public EmpleadoResponseDTO obtenerEmpleado(String id) {
        return EmpleadoMapper.toResponse(buscarPorId(id));
    }

    @Override
    public List<EmpleadoResponseDTO> listarEmpleados() {
        return empleadoRepository.findAll().stream()
                .map(EmpleadoMapper::toResponse)
                .toList();
    }

    @Override
    public EmpleadoResponseDTO actualizarEmpleado(String id, EmpleadoRequestDTO dto, String solicitanteId) {
        Empleado existente = buscarPorId(id);

        Empleado conMismoUsuario = empleadoRepository.findByUsuario(dto.usuario());
        if (conMismoUsuario != null && !conMismoUsuario.getId().equals(id)) {
            throw new NegocioException(CodigoError.USUARIO_YA_REGISTRADO);
        }

        boolean quedaraInactivo = dto.activo() != null && !dto.activo();
        boolean dejaraDeSerDueno = dto.rol() != Rol.DUENO;

        if (quedaraInactivo && existente.getId().equals(solicitanteId)) {
            throw new NegocioException(CodigoError.NO_PUEDES_DESACTIVARTE);
        }
        if ((quedaraInactivo || dejaraDeSerDueno) && esUltimoDuenoActivo(existente)) {
            throw new NegocioException(CodigoError.ULTIMO_DUENO);
        }

        existente.setNombre(dto.nombre());
        existente.setUsuario(dto.usuario());
        existente.setRol(dto.rol());
        if (dto.activo() != null) {
            existente.setActivo(dto.activo());
        }
        if (dto.password() != null && !dto.password().isBlank()) {
            existente.setPassword(passwordEncoder.encode(dto.password()));
        }

        return EmpleadoMapper.toResponse(guardar(existente));
    }

    @Override
    public EmpleadoResponseDTO autenticarEmpleado(String usuario, String password) {
        Empleado empleado = empleadoRepository.findByUsuario(usuario);
        if (empleado == null || !passwordCorrecta(empleado, password)) {
            throw new NegocioException(CodigoError.CREDENCIALES_INVALIDAS);
        }
        if (!Boolean.TRUE.equals(empleado.getActivo())) {
            throw new NegocioException(CodigoError.EMPLEADO_INACTIVO);
        }
        return EmpleadoMapper.toResponse(empleado);
    }

    private boolean esUltimoDuenoActivo(Empleado empleado) {
        return empleado.getRol() == Rol.DUENO
                && Boolean.TRUE.equals(empleado.getActivo())
                && empleadoRepository.countByRolAndActivo(Rol.DUENO, true) <= 1;
    }

    private boolean passwordCorrecta(Empleado empleado, String password) {
        String guardada = empleado.getPassword();
        if (guardada == null || password == null) {
            return false;
        }
        if (guardada.startsWith("$2")) {
            return passwordEncoder.matches(password, guardada);
        }

        if (guardada.equals(password)) {
            empleado.setPassword(passwordEncoder.encode(password));
            empleadoRepository.save(empleado);
            return true;
        }
        return false;
    }

    private Empleado buscarPorId(String id) {
        return empleadoRepository.findById(id)
                .orElseThrow(() -> new NegocioException(CodigoError.EMPLEADO_NO_ENCONTRADO));
    }

    private Empleado guardar(Empleado empleado) {
        try {
            return empleadoRepository.save(empleado);
        } catch (DuplicateKeyException e) {
            throw new NegocioException(CodigoError.USUARIO_YA_REGISTRADO);
        }
    }
}