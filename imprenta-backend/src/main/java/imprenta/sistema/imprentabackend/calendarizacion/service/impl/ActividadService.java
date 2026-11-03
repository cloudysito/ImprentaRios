package imprenta.sistema.imprentabackend.calendarizacion.service.impl;

import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadRequestDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadResponeDTO;
import imprenta.sistema.imprentabackend.calendarizacion.mapper.ActividadMapper;
import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;
import imprenta.sistema.imprentabackend.calendarizacion.repository.ActividadRepository;
import imprenta.sistema.imprentabackend.calendarizacion.service.IActividadService;
import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActividadService implements IActividadService {

    private final ActividadRepository actividadRepository;

    @Override
    public ActividadResponeDTO agregarActividad(ActividadRequestDTO dto) {
        Actividad guardado = actividadRepository.save(ActividadMapper.toEntity(dto));
        return  ActividadMapper.toResponse(guardado);
    }

    @Override
    public void eliminarActividad(String id) {
        actividadRepository.delete(obtenerActividad(id));
    }

    @Override
    public ActividadResponeDTO actualizarActividad(String id, ActividadRequestDTO dto) {
        Actividad actividad = obtenerActividad(id);
        ActividadMapper.actualizarEntidad(actividad, dto);
        return ActividadMapper.toResponse(actividadRepository.save(actividad));
    }

    @Override
    public ActividadResponeDTO buscarActividad(String id) {
        return ActividadMapper.toResponse(obtenerActividad(id));
    }

    private Actividad obtenerActividad(String id) {
        return actividadRepository.findById(id)
                .orElseThrow(() -> new NegocioException(CodigoError.ACTIVIDAD_NO_ENCONTRADA));
    }
}
