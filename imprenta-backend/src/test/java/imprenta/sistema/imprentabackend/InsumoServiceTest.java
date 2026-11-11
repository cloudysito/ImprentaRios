package imprenta.sistema.imprentabackend.inventario.service;

import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.inventario.dtos.MovimientoRequestDTO;
import imprenta.sistema.imprentabackend.inventario.model.Insumo;
import imprenta.sistema.imprentabackend.inventario.model.TipoMovimiento;
import imprenta.sistema.imprentabackend.inventario.repository.InsumoRepository;
import imprenta.sistema.imprentabackend.inventario.service.impl.InsumoService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InsumoServiceTest {

    @Mock
    private InsumoRepository insumoRepository;

    @Mock
    private imprenta.sistema.imprentabackend.inventario.repository.MovimientoInventarioRepository movimientoRepository;

    @InjectMocks
    private InsumoService insumoService;

    @Test
    void testRegistrarMovimientoSalida_StockInsuficiente_LanzaExcepcion() {
        Insumo insumo = new Insumo();
        insumo.setId("insumo-1");
        insumo.setCantidadDisponible(10);

        when(insumoRepository.findById("insumo-1")).thenReturn(Optional.of(insumo));

        MovimientoRequestDTO dto = new MovimientoRequestDTO(
                TipoMovimiento.SALIDA, 50, LocalDate.now(), "uso");

        assertThrows(NegocioException.class, () -> {
            insumoService.registrarMovimiento("insumo-1", dto, "empleado-1");
        });
    }
}