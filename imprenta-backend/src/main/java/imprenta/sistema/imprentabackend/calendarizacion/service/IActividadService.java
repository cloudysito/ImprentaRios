package imprenta.sistema.imprentabackend.calendarizacion.service;

import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;

public interface IActividadService {

    Actividad agregarActividad(Actividad actividad, String id) throws Exception;
    void eliminarActividad(String id) throws Exception;
    Actividad actualizarActividad(String id, Actividad actividad) throws Exception;
    Actividad buscarActividad(String id) throws Exception;

}
