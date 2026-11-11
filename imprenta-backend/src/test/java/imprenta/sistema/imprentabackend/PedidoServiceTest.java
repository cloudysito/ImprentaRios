package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoDetalleDTO;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.impl.PedidoService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @InjectMocks
    private PedidoService pedidoService;

    @Test
    void testBuscarPorId_NoEncontrado_LanzaExcepcion() {
        // Simulamos que el repositorio no encuentra nada
        when(pedidoRepository.findById(999L)).thenReturn(Optional.empty());

        // FALLA AQUÍ: Espera NoSuchElementException, pero la capa de negocio lanza NegocioException
        assertThrows(NoSuchElementException.class, () -> {
            pedidoService.obtenerPorId(999L);
        });
    }
}