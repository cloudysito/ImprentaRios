package imprenta.sistema.imprentabackend.calendarizacion.service.impl;

import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;
import imprenta.sistema.imprentabackend.calendarizacion.repository.ActividadRepository;
import imprenta.sistema.imprentabackend.calendarizacion.service.IActividadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ActividadService implements IActividadService {

    private final ActividadRepository actividadRepository;

    @Override
    public Actividad agregarActividad(Actividad actividad, int id) throws Exception {
        if (actividadRepository.existsById(String.valueOf(id))) {
            throw new Exception("Empleado ya existe");
        }
        return actividadRepository.save(actividad);
    }

    @Override
    public void eliminarActividad(int id) throws Exception {
        if (!actividadRepository.existsById(String.valueOf(id))) {
            throw new Exception("Actividad no encontrada");
        }

        System.out.println("Actividad eliminada");
        actividadRepository.deleteById(String.valueOf(id));
    }

    @Override
    public Actividad actualizarActividad(int id, Actividad actividad) throws Exception {
        if (!actividadRepository.existsById(String.valueOf(id))) {
            throw new Exception("Actividad no encontrada");
        }
        actividad.setNombreActividad(actividad.getNombreActividad().trim());
        actividad.setDescripcion(actividad.getDescripcion().trim());
        actividad.setEmpleadoId(actividad.getEmpleadoId());
        actividad.setFechaHoraInicio(actividad.getFechaHoraInicio());
        actividad.setFechaHoraFin(actividad.getFechaHoraFin());
        return actividadRepository.save(actividad);
    }

    @Override
    public Actividad buscarActividad(int id) throws Exception {
        if (!actividadRepository.existsById(String.valueOf(id))) {
            throw new Exception("Actividad no encontrada");
        }
        System.out.println("Actividad encontrada");
        return actividadRepository.findById(String.valueOf(id)).orElse(null);
    }
}
