package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.calendarizacion.repository.ActividadRepository;
import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.inventario.dtos.FaltanteInsumoDTO;
import imprenta.sistema.imprentabackend.inventario.model.ConsumoInsumo;
import imprenta.sistema.imprentabackend.inventario.model.PoliticaFaltante;
import imprenta.sistema.imprentabackend.inventario.service.IMaterialService;
import imprenta.sistema.imprentabackend.inventario.service.IReservaInventarioService;
import imprenta.sistema.imprentabackend.inventario.service.PoliticaInventario;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ProductoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.model.Prioridad;
import imprenta.sistema.imprentabackend.pedidos.model.Producto;
import imprenta.sistema.imprentabackend.pedidos.model.TipoAcabado;
import imprenta.sistema.imprentabackend.pedidos.model.TipoTinta;
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

    @Mock
    private IMaterialService materialService;

    @Mock
    private IReservaInventarioService reservaInventario;

    @Mock
    private PoliticaInventario politicaInventario;

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

    // ---------- Inventario conectado a los pedidos ----------

    private PedidoRequestDTO pedidoConUnProducto(int cantidad) {
        return new PedidoRequestDTO(
                LocalDateTime.now().plusDays(5),
                "Volantes de temporada",
                List.of(new ProductoRequestDTO(cantidad, "21 x 14 cm", TipoTinta.CMYK, TipoAcabado.NINGUNO,
                        Prioridad.MEDIA, null, "tipo-1", "material-1", List.of())),
                "cliente-1",
                null,
                null,
                null
        );
    }

    private void prepararCapturaConProductos() {
        when(clienteRepository.existsById("cliente-1")).thenReturn(true);
        when(tipoProductoRepository.existsById("tipo-1")).thenReturn(true);
        when(pedidoRepository.count()).thenReturn(0L);
    }

    private void guardarTalCual() {
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(i -> i.getArgument(0));
    }

    private FaltanteInsumoDTO faltanteOpalina() {
        return new FaltanteInsumoDTO("insumo-1", "Opalina 225 g", "hojas", 500, 400);
    }

    @Test
    void capturarPedido_ConExistencias_DescuentaMaterialYQuedaRegistrado() {
        prepararCapturaConProductos();
        guardarTalCual();
        List<ConsumoInsumo> requeridos = List.of(new ConsumoInsumo("insumo-1", 105));
        when(reservaInventario.calcularRequerimiento(anyList())).thenReturn(requeridos);
        when(reservaInventario.detectarFaltantes(requeridos)).thenReturn(List.of());

        var respuesta = pedidoService.capturarPedido(pedidoConUnProducto(100), "empleado-1");

        assertEquals(EstadoPedido.REGISTRADO, respuesta.estado());
        assertTrue(respuesta.avisosInventario().isEmpty());
        verify(reservaInventario).descontar(requeridos, respuesta.folio(), "empleado-1");
        ArgumentCaptor<Pedido> captor = ArgumentCaptor.forClass(Pedido.class);
        verify(pedidoRepository).save(captor.capture());
        assertEquals(requeridos, captor.getValue().getConsumosInventario());
    }

    @Test
    void capturarPedido_SinExistencias_PoliticaPendiente_QuedaPendienteSinDescontar() {
        prepararCapturaConProductos();
        guardarTalCual();
        List<ConsumoInsumo> requeridos = List.of(new ConsumoInsumo("insumo-1", 500));
        when(reservaInventario.calcularRequerimiento(anyList())).thenReturn(requeridos);
        when(reservaInventario.detectarFaltantes(requeridos)).thenReturn(List.of(faltanteOpalina()));
        when(politicaInventario.faltante()).thenReturn(PoliticaFaltante.PENDIENTE);

        var respuesta = pedidoService.capturarPedido(pedidoConUnProducto(500), "empleado-1");

        assertEquals(EstadoPedido.PENDIENTE_DE_MATERIAL, respuesta.estado());
        assertEquals(List.of(faltanteOpalina().mensaje()), respuesta.avisosInventario());
        verify(reservaInventario, never()).descontar(anyList(), any(), any());
        ArgumentCaptor<Pedido> captor = ArgumentCaptor.forClass(Pedido.class);
        verify(pedidoRepository).save(captor.capture());
        Pedido guardado = captor.getValue();
        assertNull(guardado.getConsumosInventario());
        assertEquals(EstadoPedido.REGISTRADO, guardado.getHistorialEstados().get(0).getEstado());
        assertEquals(EstadoPedido.PENDIENTE_DE_MATERIAL, guardado.getHistorialEstados().get(1).getEstado());
    }

    @Test
    void capturarPedido_SinExistencias_PoliticaRechazar_NoGuardaElPedido() {
        prepararCapturaConProductos();
        List<ConsumoInsumo> requeridos = List.of(new ConsumoInsumo("insumo-1", 500));
        when(reservaInventario.calcularRequerimiento(anyList())).thenReturn(requeridos);
        when(reservaInventario.detectarFaltantes(requeridos)).thenReturn(List.of(faltanteOpalina()));
        when(politicaInventario.faltante()).thenReturn(PoliticaFaltante.RECHAZAR);

        var exception = assertThrows(NegocioException.class,
                () -> pedidoService.capturarPedido(pedidoConUnProducto(500), "empleado-1"));

        assertEquals(CodigoError.INVENTARIO_INSUFICIENTE, exception.getCodigo());
        assertTrue(exception.getMessage().contains("Opalina 225 g"));
        verify(pedidoRepository, never()).save(any(Pedido.class));
        verify(reservaInventario, never()).descontar(anyList(), any(), any());
    }

    @Test
    void capturarPedido_SiFallaElGuardado_DevuelveElMaterialDescontado() {
        when(clienteRepository.existsById("cliente-1")).thenReturn(true);
        when(tipoProductoRepository.existsById("tipo-1")).thenReturn(true);
        when(pedidoRepository.count()).thenReturn(0L);
        List<ConsumoInsumo> requeridos = List.of(new ConsumoInsumo("insumo-1", 105));
        when(reservaInventario.calcularRequerimiento(anyList())).thenReturn(requeridos);
        when(reservaInventario.detectarFaltantes(requeridos)).thenReturn(List.of());
        when(pedidoRepository.save(any(Pedido.class))).thenThrow(new IllegalStateException("mongo caído"));

        assertThrows(IllegalStateException.class,
                () -> pedidoService.capturarPedido(pedidoConUnProducto(100), "empleado-1"));

        verify(reservaInventario).reintegrar(eq(requeridos), anyString(), anyString(), eq("empleado-1"));
    }

    @Test
    void cambiarEstado_Cancelado_AntesDeProducir_DevuelveElMaterial() {
        Pedido pedido = new Pedido();
        pedido.setId("pedido-1");
        pedido.setFolio("PED-2026-0001");
        pedido.setEstado(EstadoPedido.REGISTRADO);
        List<ConsumoInsumo> consumos = List.of(new ConsumoInsumo("insumo-1", 105));
        pedido.setConsumosInventario(consumos);
        when(pedidoRepository.findById("pedido-1")).thenReturn(Optional.of(pedido));
        when(pedidoRepository.save(pedido)).thenReturn(pedido);

        pedidoService.cambiarEstado("pedido-1", EstadoPedido.CANCELADO, "empleado-1");

        verify(reservaInventario).reintegrar(eq(consumos), eq("PED-2026-0001"), anyString(), eq("empleado-1"));
        assertTrue(pedido.getConsumosInventario().isEmpty());
    }

    @Test
    void cambiarEstado_Cancelado_EnProduccion_NoDevuelveElMaterial() {
        Pedido pedido = new Pedido();
        pedido.setId("pedido-1");
        pedido.setEstado(EstadoPedido.EN_PRODUCCION);
        pedido.setConsumosInventario(List.of(new ConsumoInsumo("insumo-1", 105)));
        when(pedidoRepository.findById("pedido-1")).thenReturn(Optional.of(pedido));
        when(pedidoRepository.save(pedido)).thenReturn(pedido);

        pedidoService.cambiarEstado("pedido-1", EstadoPedido.CANCELADO, "empleado-1");

        verify(reservaInventario, never()).reintegrar(anyList(), any(), any(), any());
        assertEquals(1, pedido.getConsumosInventario().size());
    }

    @Test
    void cambiarEstado_PendienteAProduccion_SinExistencias_RechazaElCambio() {
        Pedido pedido = new Pedido();
        pedido.setId("pedido-1");
        pedido.setEstado(EstadoPedido.PENDIENTE_DE_MATERIAL);
        List<ConsumoInsumo> requeridos = List.of(new ConsumoInsumo("insumo-1", 500));
        when(pedidoRepository.findById("pedido-1")).thenReturn(Optional.of(pedido));
        when(reservaInventario.calcularRequerimiento(anyList())).thenReturn(requeridos);
        when(reservaInventario.detectarFaltantes(requeridos)).thenReturn(List.of(faltanteOpalina()));

        var exception = assertThrows(NegocioException.class,
                () -> pedidoService.cambiarEstado("pedido-1", EstadoPedido.EN_PRODUCCION, "empleado-1"));

        assertEquals(CodigoError.INVENTARIO_INSUFICIENTE, exception.getCodigo());
        assertEquals(EstadoPedido.PENDIENTE_DE_MATERIAL, pedido.getEstado());
        verify(pedidoRepository, never()).save(any(Pedido.class));
    }

    @Test
    void cambiarEstado_PendienteAProduccion_ConExistencias_DescuentaYAvanza() {
        Pedido pedido = new Pedido();
        pedido.setId("pedido-1");
        pedido.setFolio("PED-2026-0007");
        pedido.setEstado(EstadoPedido.PENDIENTE_DE_MATERIAL);
        List<ConsumoInsumo> requeridos = List.of(new ConsumoInsumo("insumo-1", 500));
        when(pedidoRepository.findById("pedido-1")).thenReturn(Optional.of(pedido));
        when(pedidoRepository.save(pedido)).thenReturn(pedido);
        when(reservaInventario.calcularRequerimiento(anyList())).thenReturn(requeridos);
        when(reservaInventario.detectarFaltantes(requeridos)).thenReturn(List.of());

        var detalle = pedidoService.cambiarEstado("pedido-1", EstadoPedido.EN_PRODUCCION, "empleado-1");

        assertEquals(EstadoPedido.EN_PRODUCCION, detalle.estado());
        assertTrue(detalle.materialDescontado());
        verify(reservaInventario).descontar(requeridos, "PED-2026-0007", "empleado-1");
    }

    @Test
    void cambiarEstado_PendienteATerminado_NoSeBloqueaPorInventario() {
        Pedido pedido = new Pedido();
        pedido.setId("pedido-1");
        pedido.setEstado(EstadoPedido.PENDIENTE_DE_MATERIAL);
        when(pedidoRepository.findById("pedido-1")).thenReturn(Optional.of(pedido));
        when(pedidoRepository.save(pedido)).thenReturn(pedido);

        var detalle = pedidoService.cambiarEstado("pedido-1", EstadoPedido.TERMINADO, "empleado-1");

        assertEquals(EstadoPedido.TERMINADO, detalle.estado());
        verify(reservaInventario, never()).descontar(anyList(), any(), any());
    }

    @Test
    void iniciarProduccion_PendienteSinExistencias_NoCambiaElEstado() {
        Pedido pedido = new Pedido();
        pedido.setId("pedido-1");
        pedido.setEstado(EstadoPedido.PENDIENTE_DE_MATERIAL);
        List<ConsumoInsumo> requeridos = List.of(new ConsumoInsumo("insumo-1", 500));
        when(pedidoRepository.findById("pedido-1")).thenReturn(Optional.of(pedido));
        when(reservaInventario.calcularRequerimiento(anyList())).thenReturn(requeridos);
        when(reservaInventario.detectarFaltantes(requeridos)).thenReturn(List.of(faltanteOpalina()));

        pedidoService.iniciarProduccion("pedido-1", "empleado-1");

        assertEquals(EstadoPedido.PENDIENTE_DE_MATERIAL, pedido.getEstado());
        verify(pedidoRepository, never()).save(any(Pedido.class));
    }

    @Test
    void liberarPedidosPendientes_LiberaSoloLosQueYaAlcanzan() {
        Pedido sinMaterial = new Pedido();
        sinMaterial.setId("p1");
        sinMaterial.setFolio("PED-2026-0001");
        sinMaterial.setEstado(EstadoPedido.PENDIENTE_DE_MATERIAL);
        Pedido conMaterial = new Pedido();
        conMaterial.setId("p2");
        conMaterial.setFolio("PED-2026-0002");
        conMaterial.setEstado(EstadoPedido.PENDIENTE_DE_MATERIAL);
        List<ConsumoInsumo> requeridos = List.of(new ConsumoInsumo("insumo-1", 100));
        when(pedidoRepository.findByEstadoOrderByFechaRegistroAsc(EstadoPedido.PENDIENTE_DE_MATERIAL))
                .thenReturn(List.of(sinMaterial, conMaterial));
        when(reservaInventario.calcularRequerimiento(anyList())).thenReturn(requeridos);
        when(reservaInventario.detectarFaltantes(requeridos))
                .thenReturn(List.of(faltanteOpalina()))
                .thenReturn(List.of());

        int liberados = pedidoService.liberarPedidosPendientes(null);

        assertEquals(1, liberados);
        assertEquals(EstadoPedido.PENDIENTE_DE_MATERIAL, sinMaterial.getEstado());
        assertEquals(EstadoPedido.REGISTRADO, conMaterial.getEstado());
        assertEquals(requeridos, conMaterial.getConsumosInventario());
        verify(pedidoRepository).save(conMaterial);
        verify(pedidoRepository, never()).save(sinMaterial);
        verify(reservaInventario, times(1)).descontar(requeridos, "PED-2026-0002", null);
    }

    @Test
    void actualizarPedido_ConMaterialApartado_AjustaSoloLaDiferencia() {
        Pedido pedido = new Pedido();
        pedido.setId("p1");
        pedido.setFolio("PED-2026-0001");
        pedido.setEstado(EstadoPedido.EN_DISENIO);
        List<ConsumoInsumo> previos = List.of(new ConsumoInsumo("insumo-1", 105));
        pedido.setConsumosInventario(previos);
        List<ConsumoInsumo> nuevos = List.of(new ConsumoInsumo("insumo-1", 210));
        when(pedidoRepository.findById("p1")).thenReturn(Optional.of(pedido));
        when(clienteRepository.existsById("cliente-1")).thenReturn(true);
        when(tipoProductoRepository.existsById("tipo-1")).thenReturn(true);
        when(reservaInventario.calcularRequerimiento(anyList())).thenReturn(nuevos);
        when(pedidoRepository.save(pedido)).thenReturn(pedido);

        pedidoService.actualizarPedido("p1", pedidoConUnProducto(200), "empleado-1");

        verify(reservaInventario).ajustar(previos, nuevos, "PED-2026-0001", "empleado-1");
        assertEquals(nuevos, pedido.getConsumosInventario());
    }

    @Test
    void actualizarPedido_ConMaterialApartado_SiNoAlcanzaLoRechazaSinGuardar() {
        Pedido pedido = new Pedido();
        pedido.setId("p1");
        pedido.setFolio("PED-2026-0001");
        pedido.setEstado(EstadoPedido.REGISTRADO);
        List<ConsumoInsumo> previos = List.of(new ConsumoInsumo("insumo-1", 105));
        pedido.setConsumosInventario(previos);
        when(pedidoRepository.findById("p1")).thenReturn(Optional.of(pedido));
        when(clienteRepository.existsById("cliente-1")).thenReturn(true);
        when(tipoProductoRepository.existsById("tipo-1")).thenReturn(true);
        doThrow(new NegocioException(CodigoError.INVENTARIO_INSUFICIENTE))
                .when(reservaInventario).ajustar(any(), any(), any(), any());

        var exception = assertThrows(NegocioException.class,
                () -> pedidoService.actualizarPedido("p1", pedidoConUnProducto(9000), "empleado-1"));

        assertEquals(CodigoError.INVENTARIO_INSUFICIENTE, exception.getCodigo());
        verify(pedidoRepository, never()).save(any(Pedido.class));
    }

    // ---------- Alertas de atraso ----------

    private Pedido pedidoConEntrega(String id, LocalDateTime entrega, EstadoPedido estado) {
        Pedido pedido = new Pedido();
        pedido.setId(id);
        pedido.setFolio("PED-" + id);
        pedido.setFechaEntrega(entrega);
        pedido.setEstado(estado);
        return pedido;
    }

    @Test
    void listarPedidos_MarcaVencidosSoloLosNoTerminados() {
        LocalDateTime haceTresDias = LocalDateTime.now().minusDays(3);
        when(pedidoRepository.findAll()).thenReturn(List.of(
                pedidoConEntrega("atrasado", haceTresDias, EstadoPedido.EN_PRODUCCION),
                pedidoConEntrega("terminado", haceTresDias, EstadoPedido.TERMINADO),
                pedidoConEntrega("entregado", haceTresDias, EstadoPedido.ENTREGADO),
                pedidoConEntrega("cancelado", haceTresDias, EstadoPedido.CANCELADO),
                pedidoConEntrega("hoy", LocalDate.now().atStartOfDay(), EstadoPedido.EN_PRODUCCION),
                pedidoConEntrega("futuro", LocalDateTime.now().plusDays(2), EstadoPedido.EN_DISENIO)
        ));

        var resumen = pedidoService.listarPedidos();

        var atrasado = resumen.get(0);
        assertTrue(atrasado.vencido());
        assertEquals(3, atrasado.diasAtraso());
        for (int i = 1; i < resumen.size(); i++) {
            assertFalse(resumen.get(i).vencido(), "no debería estar vencido: " + resumen.get(i).folio());
            assertEquals(0, resumen.get(i).diasAtraso());
        }
    }
}
