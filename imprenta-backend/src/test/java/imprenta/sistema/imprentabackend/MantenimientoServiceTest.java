package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.AlertaRequestDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.MaquinaRequestDTO;
import imprenta.sistema.imprentabackend.mantenimiento.model.Maquina;
import imprenta.sistema.imprentabackend.mantenimiento.repository.MaquinaRepository;
import imprenta.sistema.imprentabackend.mantenimiento.repository.ServicioMantenimientoRepository;
import imprenta.sistema.imprentabackend.mantenimiento.service.impl.MantenimientoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MantenimientoServiceTest {

    @Mock private MaquinaRepository maquinaRepository;
    @Mock private ServicioMantenimientoRepository servicioRepository;

    @InjectMocks private MantenimientoService mantenimientoService;

    @Test
    void registrarMaquina_GuardaYNormalizaDatos() {
        MaquinaRequestDTO dto = new MaquinaRequestDTO(
                "  Guillotina  ", " Corte ", " SN-1 ", 2020, " Juan ", 30, 250);
        when(maquinaRepository.save(any(Maquina.class))).thenAnswer(invocation -> {
            Maquina maquina = invocation.getArgument(0);
            maquina.setId("maquina-1");
            return maquina;
        });
        when(servicioRepository.findByMaquinaIdOrderByFechaDesc("maquina-1"))
                .thenReturn(List.of());

        var respuesta = mantenimientoService.registrarMaquina(dto);

        assertEquals("maquina-1", respuesta.id());
        assertEquals("Guillotina", respuesta.nombre());
        assertEquals("Corte", respuesta.descripcion());
    }

    @Test
    void obtenerMaquinaNoExistente_LanzaExcepcion() {
        when(maquinaRepository.findById("404")).thenReturn(Optional.empty());

        NegocioException ex = assertThrows(NegocioException.class,
                () -> mantenimientoService.obtenerMaquina("404"));

        assertEquals(CodigoError.MAQUINA_NO_ENCONTRADA, ex.getCodigo());
    }

    @Test
    void programarAlerta_ActualizaLaMaquina() {
        Maquina maquina = new Maquina();
        maquina.setId("maquina-1");
        maquina.setNombre("Impresora");
        maquina.setPeriodicidadDias(30);
        when(maquinaRepository.findById("maquina-1")).thenReturn(Optional.of(maquina));
        when(servicioRepository.findByMaquinaIdOrderByFechaDesc("maquina-1"))
                .thenReturn(List.of());
        when(maquinaRepository.save(maquina)).thenReturn(maquina);
        LocalDateTime fecha = LocalDateTime.now().plusDays(10);

        var respuesta = mantenimientoService.programarAlerta(
                "maquina-1", new AlertaRequestDTO(fecha));

        assertEquals(fecha, maquina.getAlertaServicio());
        assertEquals(fecha, respuesta.proximoServicio());
        verify(maquinaRepository).save(maquina);
    }
}
