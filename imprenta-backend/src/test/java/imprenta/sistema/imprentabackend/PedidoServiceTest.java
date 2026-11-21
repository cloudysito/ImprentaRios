package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.calendarizacion.repository.ActividadRepository;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import imprenta.sistema.imprentabackend.pedidos.repository.ClienteRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.impl.PedidoService;
import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;

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
    void alGenerarCronograma_SinArchivoDisenio_PasaAEnDisenio() {
        Pedido pedido = new Pedido();
        pedido.setEstado(EstadoPedido.REGISTRADO);
        when(pedidoRepository.findById("p1")).thenReturn(Optional.of(pedido));

        pedidoService.alGenerarCronograma("p1");

        assertEquals(EstadoPedido.EN_DISENIO, pedido.getEstado());
        verify(pedidoRepository).save(pedido);
    }

    @Test
    void alGenerarCronograma_ConArchivoDisenio_PasaAEnProduccion() {
        Pedido pedido = new Pedido();
        pedido.setEstado(EstadoPedido.REGISTRADO);
        pedido.setArchivoDisenioId("archivo-1");
        when(pedidoRepository.findById("p1")).thenReturn(Optional.of(pedido));

        pedidoService.alGenerarCronograma("p1");

        assertEquals(EstadoPedido.EN_PRODUCCION, pedido.getEstado());
    }

    @Test
    void iniciarProduccion_NoCambiaUnPedidoTerminado() {
        Pedido pedido = new Pedido();
        pedido.setEstado(EstadoPedido.TERMINADO);
        when(pedidoRepository.findById("p1")).thenReturn(Optional.of(pedido));

        pedidoService.iniciarProduccion("p1");

        assertEquals(EstadoPedido.TERMINADO, pedido.getEstado());
        verify(pedidoRepository, never()).save(any(Pedido.class));
    }
}