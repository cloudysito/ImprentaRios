package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.calendarizacion.repository.ActividadRepository;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import imprenta.sistema.imprentabackend.pedidos.repository.ClienteRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.TipoProductoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.impl.PedidoService;
import imprenta.sistema.imprentabackend.usuarios.model.Empleado;
import imprenta.sistema.imprentabackend.usuarios.repository.EmpleadoRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
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

    @Mock
    private EmpleadoRepository empleadoRepository;

    @InjectMocks
    private PedidoService pedidoService;

    @Test
    void eliminarPedido_EliminaActividadesAntesDelPedido() {
        Pedido pedido = new Pedido();

        when(pedidoRepository.findById("pedido-1"))
                .thenReturn(Optional.of(pedido));

        pedidoService.eliminarPedido("pedido-1");

        var orden = inOrder(actividadRepository, pedidoRepository);

        orden.verify(actividadRepository).deleteByPedidoId("pedido-1");
        orden.verify(pedidoRepository).delete(pedido);
    }

    @Test
    void eliminarPedido_NoEncontrado_NoEliminaActividades() {
        when(pedidoRepository.findById("999"))
                .thenReturn(Optional.empty());

        assertThrows(
                imprenta.sistema.imprentabackend.exceptions.NegocioException.class,
                () -> pedidoService.eliminarPedido("999")
        );

        verifyNoInteractions(actividadRepository);
        verify(pedidoRepository, never()).delete(any(Pedido.class));
    }

    @Test
    void capturarPedido_SaltaFolioExistenteTrasEliminarOtroPedido() {
        String prefijo = "PED-" + LocalDate.now().getYear() + "-";

        when(clienteRepository.existsById("cliente-1")).thenReturn(true);
        when(pedidoRepository.count()).thenReturn(1L);

        when(pedidoRepository.findByFolio(prefijo + "0002"))
                .thenReturn(Optional.of(new Pedido()));

        when(pedidoRepository.findByFolio(prefijo + "0003"))
                .thenReturn(Optional.empty());

        when(pedidoRepository.save(any(Pedido.class)))
                .thenAnswer(invocacion -> invocacion.getArgument(0));

        PedidoRequestDTO dto = new PedidoRequestDTO(
                LocalDateTime.now().plusDays(1),
                "Proyecto",
                List.of(),
                "cliente-1",
                null,
                null,
                null
        );

        var respuesta = pedidoService.capturarPedido(dto, "empleado-1");

        assertEquals(prefijo + "0003", respuesta.folio());
        ArgumentCaptor<Pedido> pedidoCaptor = ArgumentCaptor.forClass(Pedido.class);
        verify(pedidoRepository).save(pedidoCaptor.capture());
        Pedido guardado = pedidoCaptor.getValue();
        assertEquals(EstadoPedido.REGISTRADO, guardado.getHistorialEstados().get(0).getEstado());
        assertEquals("empleado-1", guardado.getHistorialEstados().get(0).getEmpleadoId());
        assertNotNull(guardado.getHistorialEstados().get(0).getFecha());
    }

    @Test
    void testBuscarPorId_NoEncontrado_LanzaExcepcion() {
        when(pedidoRepository.findById("999"))
                .thenReturn(Optional.empty());

        var exception = assertThrows(
                imprenta.sistema.imprentabackend.exceptions.NegocioException.class,
                () -> pedidoService.buscarPedido("999")
        );

        assertEquals(
                imprenta.sistema.imprentabackend.exceptions.CodigoError.PEDIDO_NO_ENCONTRADO,
                exception.getCodigo()
        );
    }

    @Test
    void alGenerarCronograma_SinArchivoDisenio_PasaAEnDisenio() {
        Pedido pedido = new Pedido();
        pedido.setEstado(EstadoPedido.REGISTRADO);

        when(pedidoRepository.findById("p1"))
                .thenReturn(Optional.of(pedido));

        pedidoService.alGenerarCronograma("p1", "empleado-1");

        assertEquals(EstadoPedido.EN_DISENIO, pedido.getEstado());
        assertEquals(1, pedido.getHistorialEstados().size());
        assertEquals("empleado-1", pedido.getHistorialEstados().get(0).getEmpleadoId());
        assertNotNull(pedido.getHistorialEstados().get(0).getFecha());
        verify(pedidoRepository).save(pedido);
    }

    @Test
    void alGenerarCronograma_ConArchivoDisenio_PasaAEnProduccion() {
        Pedido pedido = new Pedido();
        pedido.setEstado(EstadoPedido.REGISTRADO);
        pedido.setArchivoDisenioId("archivo-1");

        when(pedidoRepository.findById("p1"))
                .thenReturn(Optional.of(pedido));

        pedidoService.alGenerarCronograma("p1", "empleado-1");

        assertEquals(EstadoPedido.EN_PRODUCCION, pedido.getEstado());
    }

    @Test
    void iniciarProduccion_NoCambiaUnPedidoTerminado() {
        Pedido pedido = new Pedido();
        pedido.setEstado(EstadoPedido.TERMINADO);

        when(pedidoRepository.findById("p1"))
                .thenReturn(Optional.of(pedido));

        pedidoService.iniciarProduccion("p1", "empleado-1");

        assertEquals(EstadoPedido.TERMINADO, pedido.getEstado());
        verify(pedidoRepository, never()).save(any(Pedido.class));
    }

    @Test
    void actualizarPedido_Terminado_NoSePermite() {
        Pedido pedido = new Pedido();
        pedido.setEstado(EstadoPedido.TERMINADO);

        when(pedidoRepository.findById("p1"))
                .thenReturn(Optional.of(pedido));

        PedidoRequestDTO dto = new PedidoRequestDTO(
                LocalDateTime.now().plusDays(1),
                "Proyecto",
                List.of(),
                "cliente-1",
                null,
                null,
                null
        );

        var exception = assertThrows(
                imprenta.sistema.imprentabackend.exceptions.NegocioException.class,
                () -> pedidoService.actualizarPedido("p1", dto, "empleado-1")
        );

        assertEquals(
                imprenta.sistema.imprentabackend.exceptions.CodigoError.PEDIDO_NO_EDITABLE,
                exception.getCodigo()
        );

        verify(pedidoRepository, never()).save(any(Pedido.class));
    }

    @Test
    void cambiarEstado_Cancelado_PedidoNoEntregado_ActualizaEstado() {
        Pedido pedido = new Pedido();
        pedido.setId("pedido-1");
        pedido.setEstado(EstadoPedido.REGISTRADO);

        when(pedidoRepository.findById("pedido-1"))
                .thenReturn(Optional.of(pedido));

        when(pedidoRepository.save(pedido)).thenReturn(pedido);
        when(empleadoRepository.findById("empleado-1"))
                .thenReturn(Optional.of(new Empleado("empleado-1", "Ana", "ana", null, null, true)));

        when(tipoProductoRepository.findAllById(List.of()))
                .thenReturn(List.of());

        when(actividadRepository.findByPedidoId("pedido-1"))
                .thenReturn(List.of());

        var actualizado = pedidoService.cambiarEstado(
                "pedido-1",
                EstadoPedido.CANCELADO,
                "empleado-1"
        );

        assertEquals(EstadoPedido.CANCELADO, actualizado.estado());
        assertEquals(1, actualizado.bitacora().size());
        assertEquals("Ana", actualizado.bitacora().get(0).usuario());
        assertEquals("Estado cambiado a cancelado", actualizado.bitacora().get(0).descripcion());
        assertNotNull(actualizado.bitacora().get(0).fecha());
        verify(pedidoRepository).save(pedido);
    }

    @Test
    void cambiarEstado_Cancelado_PedidoEntregado_RechazaCambio() {
        Pedido pedido = new Pedido();
        pedido.setEstado(EstadoPedido.ENTREGADO);

        when(pedidoRepository.findById("pedido-1"))
                .thenReturn(Optional.of(pedido));

        var exception = assertThrows(
                imprenta.sistema.imprentabackend.exceptions.NegocioException.class,
                () -> pedidoService.cambiarEstado(
                        "pedido-1",
                        EstadoPedido.CANCELADO,
                        "empleado-1"
                )
        );

        assertEquals(
                imprenta.sistema.imprentabackend.exceptions.CodigoError.PEDIDO_ENTREGADO_NO_SE_PUEDE_CANCELAR,
                exception.getCodigo()
        );

        verify(pedidoRepository, never()).save(any(Pedido.class));
    }
}