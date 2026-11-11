package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.impl.PedidoService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
        when(pedidoRepository.findById("999")).thenReturn(Optional.empty());

        var exception = assertThrows(imprenta.sistema.imprentabackend.exceptions.NegocioException.class,
                () -> pedidoService.buscarPedido("999"));
        assertEquals(imprenta.sistema.imprentabackend.exceptions.CodigoError.PEDIDO_NO_ENCONTRADO,
                exception.getCodigo());
    }
}