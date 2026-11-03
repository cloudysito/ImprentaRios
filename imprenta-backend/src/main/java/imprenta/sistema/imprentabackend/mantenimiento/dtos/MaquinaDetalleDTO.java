package imprenta.sistema.imprentabackend.mantenimiento.dtos;

import imprenta.sistema.imprentabackend.mantenimiento.model.EstatusMaquina;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record MaquinaDetalleDTO(
        String id,
        String nombre,
        String descripcion,
        String numeroSerie,
        Integer anioOperacion,
        String responsable,
        int periodicidadDias,
        int horasUso,
        LocalDate ultimoServicio,
        LocalDateTime proximoServicio,
        boolean servicioProgramado,
        EstatusMaquina estatus,
        long serviciosEnAnio,
        List<ServicioResponseDTO> historial
) {
}
