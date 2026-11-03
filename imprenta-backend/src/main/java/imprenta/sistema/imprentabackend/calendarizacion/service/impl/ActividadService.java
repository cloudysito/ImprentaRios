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

import java.util.Comparator;
import java.util.List;

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

    @Override
    public List<ActividadResponeDTO> listarActividades(String pedidoId) {
        return actividadRepository.findAll().stream()
                .filter(a -> pedidoId == null || pedidoId.isBlank() || pedidoId.equals(a.getPedidoId()))
                .sorted(Comparator.comparing(Actividad::getFechaHoraInicio))
                .map(a -> new ActividadResponeDTO(
                        a.getId(), a.getNombreActividad(), a.getDescripcion(),
                        a.getFechaHoraInicio(), a.getFechaHoraFin(),
                        a.getPedidoId(), a.getEmpleadoId()))
                .toList();
    }

    private Actividad obtenerActividad(String id) {
        return actividadRepository.findById(id)
                .orElseThrow(() -> new NegocioException(CodigoError.ACTIVIDAD_NO_ENCONTRADA));
    }
}
