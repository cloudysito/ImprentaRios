package imprenta.sistema.imprentabackend.reportes.service.impl;

import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;
import imprenta.sistema.imprentabackend.calendarizacion.repository.ActividadRepository;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.reportes.dtos.ReporteMermaDTO;
import imprenta.sistema.imprentabackend.reportes.dtos.ReporteMermaDTO.MermaPorMotivoDTO;
import imprenta.sistema.imprentabackend.reportes.dtos.ReporteMermaDTO.MermaPorPedidoDTO;
import imprenta.sistema.imprentabackend.reportes.service.IReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ReporteService implements IReporteService {

    private static final String SIN_MOTIVO = "Sin motivo";

    private final ActividadRepository actividadRepository;
    private final PedidoRepository pedidoRepository;

    @Override
    public ReporteMermaDTO reporteMerma(LocalDate desde, LocalDate hasta) {
        LocalDate fin = hasta != null ? hasta : LocalDate.now();
        LocalDate inicio = desde != null ? desde : fin.withDayOfMonth(1);

        // Se cuentan los reportes de avance hechos dentro del periodo (el día final se incluye)
        List<Actividad> reportes = actividadRepository
                .findByUltimoReporteGreaterThanEqualAndUltimoReporteLessThan(
                        inicio.atStartOfDay(), fin.plusDays(1).atStartOfDay());

        // Merma y piezas por pedido. Las piezas terminadas son las de la etapa más avanzada,
        // porque cada etapa (impresión, acabado...) cuenta las mismas piezas
        Map<String, Integer> mermaPorPedido = new LinkedHashMap<>();
        Map<String, Integer> piezasPorPedido = new HashMap<>();
        Map<String, Integer> mermaPorMotivo = new LinkedHashMap<>();

        for (Actividad a : reportes) {
            int merma = Objects.requireNonNullElse(a.getMerma(), 0);
            int piezas = Objects.requireNonNullElse(a.getPiezasTerminadas(), 0);
            mermaPorPedido.merge(a.getPedidoId(), merma, Integer::sum);
            piezasPorPedido.merge(a.getPedidoId(), piezas, Math::max);
            if (merma > 0) {
                mermaPorMotivo.merge(motivoDe(a), merma, Integer::sum);
            }
        }

        int totalMerma = mermaPorPedido.values().stream().mapToInt(Integer::intValue).sum();
        int totalPiezas = piezasPorPedido.values().stream().mapToInt(Integer::intValue).sum();

        Map<String, Pedido> pedidos = new HashMap<>();
        pedidoRepository.findAllById(mermaPorPedido.keySet()).forEach(p -> pedidos.put(p.getId(), p));

        List<MermaPorPedidoDTO> porPedido = mermaPorPedido.entrySet().stream()
                .filter(e -> e.getValue() > 0)
                .map(e -> {
                    Pedido pedido = pedidos.get(e.getKey());
                    int piezas = piezasPorPedido.getOrDefault(e.getKey(), 0);
                    return new MermaPorPedidoDTO(
                            e.getKey(),
                            pedido != null ? pedido.getFolio() : "Pedido eliminado",
                            pedido != null ? pedido.getNombreProyecto() : "",
                            piezas,
                            e.getValue(),
                            porcentaje(e.getValue(), piezas + e.getValue()));
                })
                .sorted(Comparator.comparingInt(MermaPorPedidoDTO::merma).reversed())
                .toList();

        List<MermaPorMotivoDTO> porMotivo = mermaPorMotivo.entrySet().stream()
                .map(e -> new MermaPorMotivoDTO(e.getKey(), e.getValue(), porcentaje(e.getValue(), totalMerma)))
                .sorted(Comparator.comparingInt(MermaPorMotivoDTO::merma).reversed())
                .toList();

        return new ReporteMermaDTO(inicio, fin, totalMerma, totalPiezas,
                porcentaje(totalMerma, totalPiezas + totalMerma), porMotivo, porPedido);
    }

    private String motivoDe(Actividad a) {
        String motivo = a.getMotivoMerma();
        return motivo == null || motivo.isBlank() ? SIN_MOTIVO : motivo.trim();
    }

    // Un decimal, ej. 4.8. Con base 0 regresa 0 en lugar de dividir entre cero
    private double porcentaje(int parte, int base) {
        if (base <= 0) {
            return 0;
        }
        return Math.round(parte * 1000.0 / base) / 10.0;
    }
}
