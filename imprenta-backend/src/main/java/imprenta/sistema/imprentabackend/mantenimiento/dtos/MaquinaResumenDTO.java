package imprenta.sistema.imprentabackend.mantenimiento.dtos;

import imprenta.sistema.imprentabackend.mantenimiento.model.EstatusMaquina;

import java.time.LocalDateTime;

public record MaquinaResumenDTO(
        String id,
        String nombre,
        String descripcion,
        LocalDateTime proximoServicio,
        boolean servicioProgramado,
        EstatusMaquina estatus
) {
}
