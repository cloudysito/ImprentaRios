package imprenta.sistema.imprentabackend.calendarizacion.dtos;

import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;

import java.time.LocalDateTime;

public record AsignacionDTO(
        String actividadId,
        String nombreActividad,
        LocalDateTime fechaHoraInicio,
        LocalDateTime fechaHoraFin,
        String pedidoId,
        String folio,
        String clienteNombre,
        String producto,
        int piezas,
        LocalDateTime fechaEntrega,
        EstadoPedido estadoPedido,
        int piezasTerminadas,
        int merma,
        String motivoMerma,
        String observaciones,
        LocalDateTime ultimoReporte,
        boolean terminada
) {
}
