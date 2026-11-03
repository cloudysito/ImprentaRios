package imprenta.sistema.imprentabackend.calendarizacion.service;

import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadRequestDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadResponeDTO;

import java.util.List;

public interface IActividadService {

    ActividadResponeDTO agregarActividad(ActividadRequestDTO dto);
    void eliminarActividad(String id);
    ActividadResponeDTO actualizarActividad(String id, ActividadRequestDTO dto);
    ActividadResponeDTO buscarActividad(String id);
<<<<<<< HEAD

    List<ActividadResponeDTO> listarActividades();
=======
    List<ActividadResponeDTO> listarActividades(String pedidoId);

>>>>>>> majo-front
}
