package imprenta.sistema.imprentabackend.reportes.dtos;

import java.time.LocalDate;
import java.util.List;

// Merma del taller en un periodo. porcentajeMerma = merma / (piezas terminadas + merma)
public record ReporteMermaDTO(
        LocalDate desde,
        LocalDate hasta,
        int totalMerma,
        int totalPiezasTerminadas,
        double porcentajeMerma,
        List<MermaPorMotivoDTO> porMotivo,
        List<MermaPorPedidoDTO> porPedido
) {
    public record MermaPorMotivoDTO(String motivo, int merma, double porcentajeDelTotal) {
    }

    public record MermaPorPedidoDTO(
            String pedidoId,
            String folio,
            String proyecto,
            int piezasTerminadas,
            int merma,
            double porcentajeMerma
    ) {
    }
}
