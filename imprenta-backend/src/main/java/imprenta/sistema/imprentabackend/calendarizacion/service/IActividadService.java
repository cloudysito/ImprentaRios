package imprenta.sistema.imprentabackend.calendarizacion.service;

import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;

public interface IActividadService {

    Actividad agregarActividad(Actividad actividad, int id) throws Exception;
    void eliminarActividad(int id) throws Exception;
    Actividad actualizarActividad(int id, Actividad actividad) throws Exception;
    Actividad buscarActividad(int id) throws Exception;

}
