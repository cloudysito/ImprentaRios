package imprenta.sistema.imprentabackend.calendarizacion.mapper;

import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadRequestDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadResponeDTO;
import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;

public final class ActividadMapper {
    private ActividadMapper() {}

    public static Actividad toEntity(ActividadRequestDTO dto){
        Actividad actividad = new Actividad();
        actualizarEntidad(actividad, dto);
        return actividad;
    }
    public static void actualizarEntidad(Actividad actividad, ActividadRequestDTO dto){
        actividad.setNombreActividad(dto.nombreActividad());
        actividad.setDescripcion(dto.descripcion());
        actividad.setFechaHoraInicio(dto.fechaHoraInicio());
        actividad.setFechaHoraFin(dto.fechaHoraFin());
        actividad.setPedidoId(dto.pedidoId());
        actividad.setEmpleadoId(dto.empleadoId());
    }
    public static ActividadResponeDTO toResponse(Actividad actividad){
        return new ActividadResponeDTO(
                actividad.getId(),
                actividad.getNombreActividad(),
                actividad.getDescripcion(),
                actividad.getFechaHoraInicio(),
                actividad.getFechaHoraFin(),
                actividad.getPedidoId(),
                actividad.getEmpleadoId()
        );
    }
}
