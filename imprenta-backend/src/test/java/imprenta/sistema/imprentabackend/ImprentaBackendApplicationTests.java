package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.inventario.dtos.MovimientoRequestDTO;
import imprenta.sistema.imprentabackend.inventario.model.Insumo;
import imprenta.sistema.imprentabackend.inventario.model.TipoMovimiento;
import imprenta.sistema.imprentabackend.inventario.repository.InsumoRepository;
import imprenta.sistema.imprentabackend.inventario.repository.MovimientoInventarioRepository;
import imprenta.sistema.imprentabackend.inventario.service.impl.InsumoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ImprentaBackendApplicationTests {

    @Mock
    private InsumoRepository insumoRepository;

    @Mock
    private MovimientoInventarioRepository movimientoRepository;

    @InjectMocks
    private InsumoService insumoService;

    @Test
    void registrarEntradaIncrementaExistencia() {
        Insumo insumo = new Insumo();
        insumo.setId("insumo-1");
        insumo.setCantidadDisponible(50);
        when(insumoRepository.findById("insumo-1")).thenReturn(Optional.of(insumo));
        when(insumoRepository.save(any(Insumo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        insumoService.registrarMovimiento("insumo-1",
                new MovimientoRequestDTO(TipoMovimiento.ENTRADA, 20, LocalDate.now(), "compra"),
                "empleado-1");

        assertEquals(70, insumo.getCantidadDisponible());
        verify(movimientoRepository).save(any());
    }

    @Test
    void registrarSalidaSinExistenciaSuficienteFalla() {
        Insumo insumo = new Insumo();
        insumo.setId("insumo-1");
        insumo.setCantidadDisponible(10);
        when(insumoRepository.findById("insumo-1")).thenReturn(Optional.of(insumo));

        NegocioException exception = assertThrows(NegocioException.class, () ->
                insumoService.registrarMovimiento("insumo-1",
                        new MovimientoRequestDTO(TipoMovimiento.SALIDA, 11, LocalDate.now(), "uso"),
                        "empleado-1"));

        assertEquals(CodigoError.INVENTARIO_INSUFICIENTE, exception.getCodigo());
        verify(insumoRepository, never()).save(any());
    }
}
