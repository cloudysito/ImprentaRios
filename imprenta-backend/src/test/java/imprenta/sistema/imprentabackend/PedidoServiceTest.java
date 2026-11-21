package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.calendarizacion.repository.ActividadRepository;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import imprenta.sistema.imprentabackend.pedidos.repository.ClienteRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.TipoProductoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.impl.PedidoService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private ActividadRepository actividadRepository;

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private TipoProductoRepository tipoProductoRepository;

    @InjectMocks
    private PedidoService pedidoService;

    @Test
    void eliminarPedido_EliminaActividadesAntesDelPedido() {
        Pedido pedido = new Pedido();
        when(pedidoRepository.findById("pedido-1")).thenReturn(Optional.of(pedido));

        pedidoService.eliminarPedido("pedido-1");

        var orden = inOrder(actividadRepository, pedidoRepository);
        orden.verify(actividadRepository).deleteByPedidoId("pedido-1");
        orden.verify(pedidoRepository).delete(pedido);
    }

    @Test
    void eliminarPedido_NoEncontrado_NoEliminaActividades() {
        when(pedidoRepository.findById("999")).thenReturn(Optional.empty());

        assertThrows(imprenta.sistema.imprentabackend.exceptions.NegocioException.class,
                () -> pedidoService.eliminarPedido("999"));

        verifyNoInteractions(actividadRepository);
        verify(pedidoRepository, never()).delete(any(Pedido.class));
    }

    @Test
    void capturarPedido_SaltaFolioExistenteTrasEliminarOtroPedido() {
        String prefijo = "PED-" + LocalDate.now().getYear() + "-";
        when(clienteRepository.existsById("cliente-1")).thenReturn(true);
        when(pedidoRepository.count()).thenReturn(1L);
        when(pedidoRepository.findByFolio(prefijo + "0002")).thenReturn(Optional.of(new Pedido()));
        when(pedidoRepository.findByFolio(prefijo + "0003")).thenReturn(Optional.empty());
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocacion -> invocacion.getArgument(0));
        PedidoRequestDTO dto = new PedidoRequestDTO(
                LocalDateTime.now().plusDays(1), "Proyecto", List.of(), "cliente-1", null, null, null);

        var respuesta = pedidoService.capturarPedido(dto, "empleado-1");

        assertEquals(prefijo + "0003", respuesta.folio());
    }

    @Test
    void testBuscarPorId_NoEncontrado_LanzaExcepcion() {
        when(pedidoRepository.findById("999")).thenReturn(Optional.empty());

        var exception = assertThrows(imprenta.sistema.imprentabackend.exceptions.NegocioException.class,
                () -> pedidoService.buscarPedido("999"));
        assertEquals(imprenta.sistema.imprentabackend.exceptions.CodigoError.PEDIDO_NO_ENCONTRADO,
                exception.getCodigo());
    }

    @Test
    void cambiarEstado_Cancelado_PedidoNoEntregado_ActualizaEstado() {
        Pedido pedido = new Pedido();
        pedido.setId("pedido-1");
        pedido.setEstado(EstadoPedido.REGISTRADO);
        when(pedidoRepository.findById("pedido-1")).thenReturn(Optional.of(pedido));
        when(pedidoRepository.save(pedido)).thenReturn(pedido);
        when(tipoProductoRepository.findAllById(List.of())).thenReturn(List.of());
        when(actividadRepository.findByPedidoId("pedido-1")).thenReturn(List.of());

        var actualizado = pedidoService.cambiarEstado("pedido-1", EstadoPedido.CANCELADO);

        assertEquals(EstadoPedido.CANCELADO, actualizado.estado());
        verify(pedidoRepository).save(pedido);
    }

    @Test
    void cambiarEstado_Cancelado_PedidoEntregado_RechazaCambio() {
        Pedido pedido = new Pedido();
        pedido.setEstado(EstadoPedido.ENTREGADO);
        when(pedidoRepository.findById("pedido-1")).thenReturn(Optional.of(pedido));

        var exception = assertThrows(imprenta.sistema.imprentabackend.exceptions.NegocioException.class,
                () -> pedidoService.cambiarEstado("pedido-1", EstadoPedido.CANCELADO));

        assertEquals(imprenta.sistema.imprentabackend.exceptions.CodigoError.PEDIDO_ENTREGADO_NO_SE_PUEDE_CANCELAR,
                exception.getCodigo());
        verify(pedidoRepository, never()).save(any(Pedido.class));
    }
}