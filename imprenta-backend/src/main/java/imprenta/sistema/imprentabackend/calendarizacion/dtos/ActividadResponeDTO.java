package imprenta.sistema.imprentabackend.calendarizacion.dtos;

import java.time.LocalDateTime;

public record ActividadResponeDTO(
        String id,
        String nombreActividad,
        String descripcion,
        LocalDateTime fechaHoraInicio,
        LocalDateTime fechaHoraFin,
        String pedidoId,
        String empleadoId
) {}
