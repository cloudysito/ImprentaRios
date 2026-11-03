package imprenta.sistema.imprentabackend.calendarizacion.service;

import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadRequestDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadResponeDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.AsignacionDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.ReporteAvanceDTO;

import java.time.LocalDate;
import java.util.List;

public interface IActividadService {
    ActividadResponeDTO agregarActividad(ActividadRequestDTO dto);
    void eliminarActividad(String id);
    ActividadResponeDTO actualizarActividad(String id, ActividadRequestDTO dto);
    ActividadResponeDTO buscarActividad(String id);
    List<ActividadResponeDTO> listarActividades(String pedidoId);

    List<AsignacionDTO> misAsignaciones(String empleadoId, LocalDate fecha);
    AsignacionDTO reportarAvance(String id, ReporteAvanceDTO dto, String empleadoId, boolean esDueno);
    AsignacionDTO terminarActividad(String id, String empleadoId, boolean esDueno);
}
