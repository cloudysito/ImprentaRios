package imprenta.sistema.imprentabackend.calendarizacion.service;

import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadRequestDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadResponeDTO;
import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;

public interface IActividadService {

    ActividadResponeDTO agregarActividad(ActividadRequestDTO dto) throws Exception;
    void eliminarActividad(String id) throws Exception;
    ActividadResponeDTO actualizarActividad(String id, ActividadRequestDTO dto) throws Exception;
    ActividadResponeDTO buscarActividad(String id) throws Exception;

}
