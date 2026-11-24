package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.usuarios.dtos.EmpleadoRequestDTO;
import imprenta.sistema.imprentabackend.usuarios.model.Empleado;
import imprenta.sistema.imprentabackend.usuarios.model.Rol;
import imprenta.sistema.imprentabackend.usuarios.repository.EmpleadoRepository;
import imprenta.sistema.imprentabackend.usuarios.service.impl.EmpleadoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpleadoServiceTest {
    @Mock
    private EmpleadoRepository empleadoRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EmpleadoService empleadoService;

    @Test
    void eliminarseASiMismo_LanzaExcepcion() {
        Empleado empleado = new Empleado("empleado-1", "Ana", "ana", "hash", Rol.DUENO, true);
        when(empleadoRepository.findById("empleado-1")).thenReturn(Optional.of(empleado));

        NegocioException ex = assertThrows(NegocioException.class,
                () -> empleadoService.eliminarEmpleado("empleado-1", "empleado-1"));

        assertEquals(CodigoError.NO_PUEDES_ELIMINARTE, ex.getCodigo());
        verify(empleadoRepository, never()).save(any());
    }

    @Test
    void eliminarUltimoDuenoActivo_LanzaExcepcion() {
        Empleado empleado = new Empleado("empleado-1", "Ana", "ana", "hash", Rol.DUENO, true);
        when(empleadoRepository.findById("empleado-1")).thenReturn(Optional.of(empleado));
        when(empleadoRepository.countByRolAndActivo(Rol.DUENO, true)).thenReturn(1L);

        NegocioException ex = assertThrows(NegocioException.class,
                () -> empleadoService.eliminarEmpleado("empleado-1", "dueno-1"));

        assertEquals(CodigoError.ULTIMO_DUENO, ex.getCodigo());
        verify(empleadoRepository, never()).save(any());
    }

    @Test
    void agregarEmpleado_CifraPasswordYGuardaComoActivo() {
        EmpleadoRequestDTO dto = new EmpleadoRequestDTO(
                "Ana Ruiz", "aruiz", "secreto123", Rol.SECRETARIA, null);
        when(empleadoRepository.existsByUsuario("aruiz")).thenReturn(false);
        when(passwordEncoder.encode("secreto123")).thenReturn("$2hash");
        when(empleadoRepository.save(any(Empleado.class)))
                .thenAnswer(invocation -> {
                    Empleado empleado = invocation.getArgument(0);
                    empleado.setId("empleado-1");
                    return empleado;
                });

        var respuesta = empleadoService.agregarEmpleado(dto);

        assertEquals("empleado-1", respuesta.id());
        assertEquals(Rol.SECRETARIA, respuesta.rol());
        assertEquals(Boolean.TRUE, respuesta.activo());
        verify(passwordEncoder).encode("secreto123");
    }

    @Test
    void autenticarEmpleado_UsuarioInactivo_LanzaExcepcion() {
        Empleado empleado = new Empleado(
                "empleado-1", "Ana", "ana", "$2hash", Rol.DUENO, false);
        when(empleadoRepository.findByUsuario("ana")).thenReturn(empleado);
        when(passwordEncoder.matches("secreto123", "$2hash")).thenReturn(true);

        NegocioException ex = assertThrows(NegocioException.class,
                () -> empleadoService.autenticarEmpleado("ana", "secreto123"));

        assertEquals(CodigoError.EMPLEADO_INACTIVO, ex.getCodigo());
    }

    @Test
    void actualizarEmpleado_SinCambiarPasswordConservaPasswordExistente() {
        Empleado existente = new Empleado(
                "empleado-1", "Ana", "ana", "$2hash", Rol.SECRETARIA, true);
        EmpleadoRequestDTO dto = new EmpleadoRequestDTO(
                "Ana García", "ana", null, Rol.SECRETARIA, true);
        when(empleadoRepository.findById("empleado-1")).thenReturn(Optional.of(existente));
        when(empleadoRepository.findByUsuario("ana")).thenReturn(existente);
        when(empleadoRepository.save(existente)).thenReturn(existente);

        var respuesta = empleadoService.actualizarEmpleado("empleado-1", dto, "dueno-1");

        assertEquals("Ana García", respuesta.nombre());
        assertEquals("$2hash", existente.getPassword());
        verify(passwordEncoder, never()).encode(any());
    }
}
