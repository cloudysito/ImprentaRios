package imprenta.sistema.imprentabackend.inventario.service;

import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.inventario.dtos.MovimientoRequestDTO;
import imprenta.sistema.imprentabackend.inventario.model.Insumo;
import imprenta.sistema.imprentabackend.inventario.model.InventarioReabastecidoEvent;
import imprenta.sistema.imprentabackend.inventario.model.TipoMovimiento;
import imprenta.sistema.imprentabackend.inventario.repository.InsumoRepository;
import imprenta.sistema.imprentabackend.inventario.service.impl.InsumoService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

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

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private InsumoService insumoService;

    @Test
    void registrarMovimientoEntrada_PublicaEventoParaLiberarPedidosPendientes() {
        Insumo insumo = new Insumo();
        insumo.setId("insumo-1");
        insumo.setCantidadDisponible(10);
        when(insumoRepository.findById("insumo-1")).thenReturn(Optional.of(insumo));
        when(insumoRepository.save(insumo)).thenReturn(insumo);

        insumoService.registrarMovimiento("insumo-1",
                new MovimientoRequestDTO(TipoMovimiento.ENTRADA, 500, LocalDate.now(), "Compra a proveedor"),
                "empleado-1");

        assertEquals(510, insumo.getCantidadDisponible());
        verify(eventPublisher).publishEvent(new InventarioReabastecidoEvent("insumo-1"));
    }

    @Test
    void registrarMovimientoSalida_NoPublicaEvento() {
        Insumo insumo = new Insumo();
        insumo.setId("insumo-1");
        insumo.setCantidadDisponible(100);
        when(insumoRepository.findById("insumo-1")).thenReturn(Optional.of(insumo));
        when(insumoRepository.save(insumo)).thenReturn(insumo);

        insumoService.registrarMovimiento("insumo-1",
                new MovimientoRequestDTO(TipoMovimiento.SALIDA, 40, LocalDate.now(), "Consumo en producción"),
                "empleado-1");

        assertEquals(60, insumo.getCantidadDisponible());
        verifyNoInteractions(eventPublisher);
    }

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