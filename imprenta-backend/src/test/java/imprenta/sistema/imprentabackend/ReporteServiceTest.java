package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;
import imprenta.sistema.imprentabackend.calendarizacion.repository.ActividadRepository;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.reportes.dtos.ReporteMermaDTO;
import imprenta.sistema.imprentabackend.reportes.service.impl.ReporteService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyIterable;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReporteServiceTest {

    @Mock
    private ActividadRepository actividadRepository;

    @Mock
    private PedidoRepository pedidoRepository;

    @InjectMocks
    private ReporteService reporteService;

    private Actividad reporte(String pedidoId, int piezas, int merma, String motivo) {
        Actividad a = new Actividad();
        a.setPedidoId(pedidoId);
        a.setPiezasTerminadas(piezas);
        a.setMerma(merma);
        a.setMotivoMerma(motivo);
        a.setUltimoReporte(LocalDateTime.now());
        return a;
    }

    private Pedido pedido(String id, String folio, String proyecto) {
        Pedido p = new Pedido();
        p.setId(id);
        p.setFolio(folio);
        p.setNombreProyecto(proyecto);
        return p;
    }

    @Test
    void reporteMerma_AgrupaPorPedidoYPorMotivoYCalculaPorcentajes() {
        when(actividadRepository.findByUltimoReporteGreaterThanEqualAndUltimoReporteLessThan(any(), any()))
                .thenReturn(List.of(
                        // pedido 1: dos etapas que cuentan las mismas 1000 piezas
                        reporte("p1", 1000, 30, "Error de impresión"),
                        reporte("p1", 1000, 20, "Papel dañado"),
                        reporte("p2", 500, 25, "Error de impresión"),
                        reporte("p3", 200, 0, null)));
        when(pedidoRepository.findAllById(anyIterable())).thenReturn(List.of(
                pedido("p1", "PED-2026-0001", "Volantes"),
                pedido("p2", "PED-2026-0002", "Trípticos"),
                pedido("p3", "PED-2026-0003", "Carteles")));

        ReporteMermaDTO reporte = reporteService.reporteMerma(LocalDate.of(2026, 11, 1), LocalDate.of(2026, 11, 23));

        assertEquals(75, reporte.totalMerma());
        // 1000 (p1, no 2000: se toma la etapa más avanzada) + 500 + 200
        assertEquals(1700, reporte.totalPiezasTerminadas());
        // 75 / (1700 + 75) = 4.2 %
        assertEquals(4.2, reporte.porcentajeMerma());

        // por pedido: solo los que tuvieron merma, el mayor primero
        assertEquals(2, reporte.porPedido().size());
        assertEquals("PED-2026-0001", reporte.porPedido().get(0).folio());
        assertEquals(50, reporte.porPedido().get(0).merma());
        assertEquals(4.8, reporte.porPedido().get(0).porcentajeMerma()); // 50 / 1050
        assertEquals("PED-2026-0002", reporte.porPedido().get(1).folio());

        // por motivo: "Error de impresión" 55 de 75
        assertEquals("Error de impresión", reporte.porMotivo().get(0).motivo());
        assertEquals(55, reporte.porMotivo().get(0).merma());
        assertEquals(73.3, reporte.porMotivo().get(0).porcentajeDelTotal());
        assertEquals("Papel dañado", reporte.porMotivo().get(1).motivo());
    }

    @Test
    void reporteMerma_MotivoVacioSeAgrupaComoSinMotivo() {
        when(actividadRepository.findByUltimoReporteGreaterThanEqualAndUltimoReporteLessThan(any(), any()))
                .thenReturn(List.of(reporte("p1", 100, 10, "  ")));
        when(pedidoRepository.findAllById(anyIterable())).thenReturn(List.of(pedido("p1", "PED-2026-0001", "X")));

        ReporteMermaDTO reporte = reporteService.reporteMerma(null, null);

        assertEquals("Sin motivo", reporte.porMotivo().get(0).motivo());
    }

    @Test
    void reporteMerma_SinReportes_RegresaCeros() {
        when(actividadRepository.findByUltimoReporteGreaterThanEqualAndUltimoReporteLessThan(any(), any()))
                .thenReturn(List.of());
        when(pedidoRepository.findAllById(anyIterable())).thenReturn(List.of());

        ReporteMermaDTO reporte = reporteService.reporteMerma(null, null);

        assertEquals(0, reporte.totalMerma());
        assertEquals(0.0, reporte.porcentajeMerma());
        assertTrue(reporte.porPedido().isEmpty());
        assertTrue(reporte.porMotivo().isEmpty());
    }

    @Test
    void reporteMerma_ElDiaFinalSeIncluyeEnLaConsulta() {
        when(actividadRepository.findByUltimoReporteGreaterThanEqualAndUltimoReporteLessThan(any(), any()))
                .thenReturn(List.of());
        when(pedidoRepository.findAllById(anyIterable())).thenReturn(List.of());

        reporteService.reporteMerma(LocalDate.of(2026, 11, 1), LocalDate.of(2026, 11, 23));

        verify(actividadRepository).findByUltimoReporteGreaterThanEqualAndUltimoReporteLessThan(
                LocalDate.of(2026, 11, 1).atStartOfDay(), LocalDate.of(2026, 11, 24).atStartOfDay());
    }
}
