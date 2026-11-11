package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.inventario.dtos.MovimientoRequestDTO;
import imprenta.sistema.imprentabackend.inventario.model.Insumo;
import imprenta.sistema.imprentabackend.inventario.model.TipoMovimiento;
import imprenta.sistema.imprentabackend.inventario.repository.InsumoRepository;
import imprenta.sistema.imprentabackend.inventario.repository.MovimientoInventarioRepository;
import imprenta.sistema.imprentabackend.inventario.service.impl.InsumoService;
import imprenta.sistema.imprentabackend.pedidos.dtos.CambioEstadoDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoDetalleDTO;
import imprenta.sistema.imprentabackend.pedidos.mappers.PedidoMapper;
import imprenta.sistema.imprentabackend.pedidos.model.Cliente;
import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import imprenta.sistema.imprentabackend.pedidos.repository.ClienteRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.impl.PedidoService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas Unitarias del Backend - ImprentaRios")
class ImprentaBackendApplicationTests {

    @Test
    @DisplayName("Carga básica del contexto de pruebas")
    void contextLoads() {
        // Prueba inicial de humo
        assertTrue(true);
    }

    // -------------------------------------------------------------------------
    // SECCIÓN DE PRUEBAS DEL MÓDULO DE PEDIDOS
    // -------------------------------------------------------------------------
    @Nested
    @DisplayName("Pruebas de Servicio de Pedidos")
    class PedidosTests {

        @Mock
        private PedidoRepository pedidoRepository;

        @Mock
        private ClienteRepository clienteRepository;

        @Mock
        private PedidoMapper pedidoMapper;

        @InjectMocks
        private PedidoService pedidoService;

        private Pedido pedido;
        private Cliente cliente;

        @BeforeEach
        void setUp() {
            cliente = new Cliente();
            cliente.setId(1L);
            cliente.setNombre("Cliente de Prueba");

            pedido = new Pedido();
            pedido.setId(100L);
            pedido.setFolio("PED-2026-001");
            pedido.setCliente(cliente);
            pedido.setEstado(EstadoPedido.RECIBIDO);
        }

        @Test
        @DisplayName("Obtener pedido por ID existente debe retornar el DTO")
        void testObtenerPorId_Exitoso() {
            when(pedidoRepository.findById(100L)).thenReturn(Optional.of(pedido));
            PedidoDetalleDTO dto = new PedidoDetalleDTO();
            when(pedidoMapper.toDetalleDTO(pedido)).thenReturn(dto);

            PedidoDetalleDTO resultado = pedidoService.obtenerPorId(100L);

            assertNotNull(resultado);
            verify(pedidoRepository, times(1)).findById(100L);
        }

        @Test
        @DisplayName("Obtener pedido por ID inexistente debe lanzar NegocioException")
        void testObtenerPorId_NoEncontrado_LanzaExcepcion() {
            when(pedidoRepository.findById(999L)).thenReturn(Optional.empty());

            assertThrows(NegocioException.class, () -> pedidoService.obtenerPorId(999L));
        }

        @Test
        @DisplayName("Cambiar estado de un pedido actualiza el estatus correctamente")
        void testCambiarEstado_Exitoso() {
            when(pedidoRepository.findById(100L)).thenReturn(Optional.of(pedido));
            when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedido);

            CambioEstadoDTO cambioDTO = new CambioEstadoDTO();
            cambioDTO.setNuevoEstado(EstadoPedido.EN_PROCESO);

            pedidoService.cambiarEstado(100L, cambioDTO);

            assertEquals(EstadoPedido.EN_PROCESO, pedido.getEstado());
            verify(pedidoRepository).save(pedido);
        }
    }

    // -------------------------------------------------------------------------
    // SECCIÓN DE PRUEBAS DEL MÓDULO DE INVENTARIO
    // -------------------------------------------------------------------------
    @Nested
    @DisplayName("Pruebas de Servicio de Inventario")
    class InventarioTests {

        @Mock
        private InsumoRepository insumoRepository;

        @Mock
        private MovimientoInventarioRepository movimientoRepository;

        @InjectMocks
        private InsumoService insumoService;

        private Insumo insumo;

        @BeforeEach
        void setUp() {
            insumo = new Insumo();
            insumo.setId(1L);
            insumo.setNombre("Papel Couché 300g");
            insumo.setStockActual(50);
            insumo.setStockMinimo(10);
        }

        @Test
        @DisplayName("Movimiento de entrada incrementa el stock actual")
        void testRegistrarMovimientoEntrada_IncrementaStock() {
            when(insumoRepository.findById(1L)).thenReturn(Optional.of(insumo));

            MovimientoRequestDTO dto = new MovimientoRequestDTO();
            dto.setInsumoId(1L);
            dto.setTipoMovimiento(TipoMovimiento.ENTRADA);
            dto.setCantidad(20);

            insumoService.registrarMovimiento(dto);

            assertEquals(70, insumo.getStockActual());
            verify(insumoRepository).save(insumo);
        }

        @Test
        @DisplayName("Salida con cantidad mayor al stock actual lanza NegocioException")
        void testRegistrarMovimientoSalida_StockInsuficiente_LanzaExcepcion() {
            when(insumoRepository.findById(1L)).thenReturn(Optional.of(insumo));

            MovimientoRequestDTO dto = new MovimientoRequestDTO();
            dto.setInsumoId(1L);
            dto.setTipoMovimiento(TipoMovimiento.SALIDA);
            dto.setCantidad(100);

            assertThrows(NegocioException.class, () -> insumoService.registrarMovimiento(dto));
        }
    }
}
