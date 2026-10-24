package imprenta.sistema.imprentabackend.calendarizacion.service.impl;

import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadRequestDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadResponeDTO;
import imprenta.sistema.imprentabackend.calendarizacion.mapper.ActividadMapper;
import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;
import imprenta.sistema.imprentabackend.calendarizacion.repository.ActividadRepository;
import imprenta.sistema.imprentabackend.calendarizacion.service.IActividadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ActividadService implements IActividadService {

    private final ActividadRepository actividadRepository;

    @Override
    public ActividadResponeDTO agregarActividad(ActividadRequestDTO dto) throws Exception {
        Actividad guardado = actividadRepository.save(ActividadMapper.toEntity(dto));
        return  ActividadMapper.toResponse(guardado);
    }

    @Override
    public void eliminarActividad(String id) throws Exception {
        Actividad actividad = actividadRepository.findById(id).orElseThrow(NoSuchElementException::new);
        actividadRepository.delete(actividad);
    }

    @Override
    public ActividadResponeDTO actualizarActividad(String id, ActividadRequestDTO dto) throws Exception {
        Actividad actividad = actividadRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Actividad no encontrada"));
        ActividadMapper.actualizarEntidad(actividad, dto);
        return ActividadMapper.toResponse(actividadRepository.save(actividad));
    }

    @Override
    public ActividadResponeDTO buscarActividad(String id) throws Exception {
        Actividad actividad = actividadRepository.findById(String.valueOf(id))
                .orElseThrow(() -> new NoSuchElementException("Actividad no encontrada"));
        return ActividadMapper.toResponse(actividad);
    }
}
