package imprenta.sistema.imprentabackend.mantenimiento.dtos;

import imprenta.sistema.imprentabackend.mantenimiento.model.TipoServicio;

import java.time.LocalDate;

public record ServicioResponseDTO(
        String id,
        TipoServicio tipo,
        LocalDate fecha,
        String tecnico,
        Double paroEstimadoHoras,
        String refacciones,
        String notas
) {
}
