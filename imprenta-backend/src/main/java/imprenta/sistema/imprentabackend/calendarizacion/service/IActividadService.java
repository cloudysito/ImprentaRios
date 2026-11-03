package imprenta.sistema.imprentabackend.calendarizacion.service;

import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadRequestDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadResponeDTO;

public interface IActividadService {

    ActividadResponeDTO agregarActividad(ActividadRequestDTO dto);
    void eliminarActividad(String id);
    ActividadResponeDTO actualizarActividad(String id, ActividadRequestDTO dto);
    ActividadResponeDTO buscarActividad(String id);

}
