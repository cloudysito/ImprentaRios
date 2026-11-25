package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.inventario.dtos.FaltanteInsumoDTO;
import imprenta.sistema.imprentabackend.inventario.model.ConsumoInsumo;
import imprenta.sistema.imprentabackend.inventario.model.Insumo;
import imprenta.sistema.imprentabackend.inventario.model.Material;
import imprenta.sistema.imprentabackend.inventario.model.MovimientoInventario;
import imprenta.sistema.imprentabackend.inventario.model.PoliticaFaltante;
import imprenta.sistema.imprentabackend.inventario.model.TipoMovimiento;
import imprenta.sistema.imprentabackend.inventario.repository.InsumoRepository;
import imprenta.sistema.imprentabackend.inventario.repository.MaterialRepository;
import imprenta.sistema.imprentabackend.inventario.repository.MovimientoInventarioRepository;
import imprenta.sistema.imprentabackend.inventario.service.PoliticaInventario;
import imprenta.sistema.imprentabackend.inventario.service.impl.ReservaInventarioService;
import imprenta.sistema.imprentabackend.pedidos.model.Producto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservaInventarioServiceTest {

    @Mock
    private InsumoRepository insumoRepository;

    @Mock
    private MaterialRepository materialRepository;

    @Mock
    private MovimientoInventarioRepository movimientoRepository;

    private ReservaInventarioService servicio;

    @BeforeEach
    void preparar() {
        // 5 % de margen de merma, como viene por defecto
        servicio = new ReservaInventarioService(insumoRepository, materialRepository, movimientoRepository,
                new PoliticaInventario(PoliticaFaltante.PENDIENTE, 0.05));
    }

    private Insumo insumo(String id, String nombre, int existencia) {
        Insumo insumo = new Insumo();
        insumo.setId(id);
        insumo.setNombre(nombre);
        insumo.setUnidad("hojas");
        insumo.setCantidadDisponible(existencia);
        return insumo;
    }

    private Producto producto(String materialId, int cantidad) {
        Producto producto = new Producto();
        producto.setMaterialId(materialId);
        producto.setCantidad(cantidad);
        return producto;
    }

    private Material material(String id, String insumoId) {
        return new Material(id, "Material " + id, 135, insumoId);
    }

    @Test
    void calcularRequerimiento_SumaProductosQueUsanElMismoInsumo() {
        when(materialRepository.findById("couche")).thenReturn(Optional.of(material("couche", "insumo-couche")));
        when(materialRepository.findById("bond")).thenReturn(Optional.of(material("bond", "insumo-bond")));

        List<ConsumoInsumo> requeridos = servicio.calcularRequerimiento(List.of(
                producto("couche", 100), producto("bond", 200), producto("couche", 100)));

        // 100 piezas + 5 % = 105, dos veces el mismo papel = 210
        assertEquals(List.of(new ConsumoInsumo("insumo-couche", 210), new ConsumoInsumo("insumo-bond", 210)),
                requeridos);
    }

    @Test
    void calcularRequerimiento_MaterialInexistente_LanzaExcepcion() {
        when(materialRepository.findById("nada")).thenReturn(Optional.empty());

        var exception = assertThrows(NegocioException.class,
                () -> servicio.calcularRequerimiento(List.of(producto("nada", 10))));

        assertEquals(CodigoError.MATERIAL_NO_ENCONTRADO, exception.getCodigo());
    }

    @Test
    void detectarFaltantes_ReportaLoQueNoAlcanza() {
        when(insumoRepository.findById("a")).thenReturn(Optional.of(insumo("a", "Opalina 225 g", 400)));
        when(insumoRepository.findById("b")).thenReturn(Optional.of(insumo("b", "Bond 90 g", 5000)));

        List<FaltanteInsumoDTO> faltantes = servicio.detectarFaltantes(
                List.of(new ConsumoInsumo("a", 500), new ConsumoInsumo("b", 1000)));

        assertEquals(1, faltantes.size());
        assertEquals("Opalina 225 g", faltantes.get(0).insumoNombre());
        assertEquals(100, faltantes.get(0).faltante());
        assertEquals("Opalina 225 g: faltan 100 hojas (se requieren 500, hay 400)", faltantes.get(0).mensaje());
    }

    @Test
    void descontar_SiHayExistencias_RebajaYRegistraSalidaConElFolio() {
        Insumo papel = insumo("a", "Opalina 225 g", 1000);
        when(insumoRepository.findById("a")).thenReturn(Optional.of(papel));

        servicio.descontar(List.of(new ConsumoInsumo("a", 300)), "PED-2026-0001", "empleado-1");

        assertEquals(700, papel.getCantidadDisponible());
        verify(insumoRepository).save(papel);
        ArgumentCaptor<MovimientoInventario> captor = ArgumentCaptor.forClass(MovimientoInventario.class);
        verify(movimientoRepository).save(captor.capture());
        MovimientoInventario movimiento = captor.getValue();
        assertEquals(TipoMovimiento.SALIDA, movimiento.getTipo());
        assertEquals(300, movimiento.getCantidad());
        assertEquals("Consumo en producción · PED-2026-0001", movimiento.getMotivo());
        assertEquals("empleado-1", movimiento.getEmpleadoId());
    }

    @Test
    void descontar_TodoONada_SiUnInsumoNoAlcanzaNoSeTocaNinguno() {
        Insumo suficiente = insumo("a", "Bond 90 g", 5000);
        Insumo escaso = insumo("b", "Opalina 225 g", 400);
        when(insumoRepository.findById("a")).thenReturn(Optional.of(suficiente));
        when(insumoRepository.findById("b")).thenReturn(Optional.of(escaso));

        var exception = assertThrows(NegocioException.class, () -> servicio.descontar(
                List.of(new ConsumoInsumo("a", 100), new ConsumoInsumo("b", 500)), "PED-2026-0001", "empleado-1"));

        assertEquals(CodigoError.INVENTARIO_INSUFICIENTE, exception.getCodigo());
        assertTrue(exception.getMessage().contains("Opalina 225 g"));
        assertEquals(5000, suficiente.getCantidadDisponible());
        assertEquals(400, escaso.getCantidadDisponible());
        verify(insumoRepository, never()).save(any(Insumo.class));
        verify(movimientoRepository, never()).save(any(MovimientoInventario.class));
    }

    @Test
    void reintegrar_DevuelveElMaterialYRegistraEntrada() {
        Insumo papel = insumo("a", "Opalina 225 g", 700);
        when(insumoRepository.findById("a")).thenReturn(Optional.of(papel));

        servicio.reintegrar(List.of(new ConsumoInsumo("a", 300)), "PED-2026-0001", "pedido cancelado", "empleado-1");

        assertEquals(1000, papel.getCantidadDisponible());
        ArgumentCaptor<MovimientoInventario> captor = ArgumentCaptor.forClass(MovimientoInventario.class);
        verify(movimientoRepository).save(captor.capture());
        assertEquals(TipoMovimiento.ENTRADA, captor.getValue().getTipo());
        assertEquals("Devolución de producción · PED-2026-0001 · pedido cancelado", captor.getValue().getMotivo());
    }

    @Test
    void reintegrar_InsumoEliminado_NoFalla() {
        when(insumoRepository.findById("a")).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> servicio.reintegrar(
                List.of(new ConsumoInsumo("a", 300)), "PED-2026-0001", "pedido cancelado", "empleado-1"));

        verify(movimientoRepository, never()).save(any(MovimientoInventario.class));
    }

    @Test
    void ajustar_SiElPedidoNecesitaMas_DescuentaSoloLaDiferencia() {
        Insumo papel = insumo("a", "Opalina 225 g", 1000);
        when(insumoRepository.findById("a")).thenReturn(Optional.of(papel));

        servicio.ajustar(List.of(new ConsumoInsumo("a", 100)), List.of(new ConsumoInsumo("a", 250)),
                "PED-2026-0001", "empleado-1");

        assertEquals(850, papel.getCantidadDisponible());
        ArgumentCaptor<MovimientoInventario> captor = ArgumentCaptor.forClass(MovimientoInventario.class);
        verify(movimientoRepository).save(captor.capture());
        assertEquals(TipoMovimiento.SALIDA, captor.getValue().getTipo());
        assertEquals(150, captor.getValue().getCantidad());
    }

    @Test
    void ajustar_SiElPedidoNecesitaMenos_DevuelveLaDiferencia() {
        Insumo papel = insumo("a", "Opalina 225 g", 1000);
        when(insumoRepository.findById("a")).thenReturn(Optional.of(papel));

        servicio.ajustar(List.of(new ConsumoInsumo("a", 250)), List.of(new ConsumoInsumo("a", 100)),
                "PED-2026-0001", "empleado-1");

        assertEquals(1150, papel.getCantidadDisponible());
        ArgumentCaptor<MovimientoInventario> captor = ArgumentCaptor.forClass(MovimientoInventario.class);
        verify(movimientoRepository).save(captor.capture());
        assertEquals(TipoMovimiento.ENTRADA, captor.getValue().getTipo());
        assertEquals(150, captor.getValue().getCantidad());
    }

    @Test
    void ajustar_SiLaDiferenciaNoAlcanza_NoTocaNada() {
        Insumo papel = insumo("a", "Opalina 225 g", 50);
        when(insumoRepository.findById("a")).thenReturn(Optional.of(papel));

        var exception = assertThrows(NegocioException.class, () -> servicio.ajustar(
                List.of(new ConsumoInsumo("a", 100)), List.of(new ConsumoInsumo("a", 400)),
                "PED-2026-0001", "empleado-1"));

        assertEquals(CodigoError.INVENTARIO_INSUFICIENTE, exception.getCodigo());
        assertEquals(50, papel.getCantidadDisponible());
        verify(insumoRepository, never()).save(any(Insumo.class));
    }
}
