package imprenta.sistema.imprentabackend.inventario.dtos;

import imprenta.sistema.imprentabackend.inventario.model.TipoMovimiento;

import java.time.LocalDate;

public record MovimientoResponseDTO(
        String id,
        String insumoId,
        String insumoNombre,
        TipoMovimiento tipo,
        int cantidad,
        LocalDate fecha,
        String motivo
) {
}
