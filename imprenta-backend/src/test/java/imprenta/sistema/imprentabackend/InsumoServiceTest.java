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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InsumoServiceTest {

    @Mock
    private InsumoRepository insumoRepository;

    @InjectMocks
    private InsumoService insumoService;

    @Test
    void testRegistrarMovimientoSalida_StockInsuficiente_LanzaExcepcion() {
        Insumo insumo = new Insumo();
        insumo.setId(1L);
        insumo.setStockActual(10); // Solo hay 10 en stock

        when(insumoRepository.findById(1L)).thenReturn(Optional.of(insumo));

        MovimientoRequestDTO dto = new MovimientoRequestDTO();
        dto.setInsumoId(1L);
        dto.setTipoMovimiento(TipoMovimiento.SALIDA);
        dto.setCantidad(50); // Se intentan retirar 50

        // FALLA AQUÍ: Si el servicio no valida el stock mínimo/disponible, no lanza NegocioException y la prueba falla
        assertThrows(NegocioException.class, () -> {
            insumoService.registrarMovimiento(dto);
        });
    }
}