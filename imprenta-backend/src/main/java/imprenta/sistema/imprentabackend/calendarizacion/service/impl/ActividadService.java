package imprenta.sistema.imprentabackend.calendarizacion.service.impl;

import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadRequestDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadResponeDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.AsignacionDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.ReporteAvanceDTO;
import imprenta.sistema.imprentabackend.calendarizacion.mapper.ActividadMapper;
import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;
import imprenta.sistema.imprentabackend.calendarizacion.repository.ActividadRepository;
import imprenta.sistema.imprentabackend.calendarizacion.service.IActividadService;
import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoDetalleDTO;
import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;
import imprenta.sistema.imprentabackend.pedidos.service.IPedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ActividadService implements IActividadService {
    private final ActividadRepository actividadRepository;
    private final IPedidoService pedidoService;

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

    @Override
    public List<AsignacionDTO> misAsignaciones(String empleadoId, LocalDate fecha) {
        if (empleadoId == null) {
            return List.of();
        }
        LocalDate dia = fecha != null ? fecha : LocalDate.now();

        List<Actividad> delDia = actividadRepository.findByEmpleadoId(empleadoId).stream()
                .filter(a -> a.getFechaHoraInicio() != null && a.getFechaHoraFin() != null)
                .filter(a -> cubreElDia(a, dia) || terminadaElDiaAnterior(a, dia))
                .sorted(Comparator.comparing(Actividad::getFechaHoraInicio))
                .toList();

        // Cada pedido se consulta una sola vez aunque tenga varias actividades
        Map<String, PedidoDetalleDTO> pedidos = new HashMap<>();
        List<AsignacionDTO> resultado = new ArrayList<>();
        for (Actividad a : delDia) {
            PedidoDetalleDTO pedido = pedidos.computeIfAbsent(a.getPedidoId(), this::buscarPedidoOrNull);
            if (pedido != null) {
                resultado.add(aAsignacion(a, pedido));
            }
        }
        return resultado;
    }

    @Override
    public AsignacionDTO reportarAvance(String id, ReporteAvanceDTO dto, String empleadoId, boolean esDueno) {
        Actividad actividad = obtenerActividad(id);
        validarQueEsSuya(actividad, empleadoId, esDueno);
        if (Boolean.TRUE.equals(actividad.getTerminada())) {
            throw new NegocioException(CodigoError.ACTIVIDAD_YA_TERMINADA);
        }

        PedidoDetalleDTO pedido = pedidoService.obtenerDetalle(actividad.getPedidoId());
        if (dto.piezasTerminadas() > pedido.piezas()) {
            throw new NegocioException(CodigoError.PIEZAS_EXCEDEN_TOTAL);
        }

        actividad.setPiezasTerminadas(dto.piezasTerminadas());
        actividad.setMerma(dto.merma());
        actividad.setMotivoMerma(textoONull(dto.motivoMerma()));
        actividad.setObservaciones(textoONull(dto.observaciones()));
        actividad.setUltimoReporte(LocalDateTime.now());

        return aAsignacion(actividadRepository.save(actividad), pedido);
    }

    @Override
    public AsignacionDTO terminarActividad(String id, String empleadoId, boolean esDueno) {
        Actividad actividad = obtenerActividad(id);
        validarQueEsSuya(actividad, empleadoId, esDueno);
        if (Boolean.TRUE.equals(actividad.getTerminada())) {
            throw new NegocioException(CodigoError.ACTIVIDAD_YA_TERMINADA);
        }

        PedidoDetalleDTO pedido = pedidoService.obtenerDetalle(actividad.getPedidoId());

        actividad.setPiezasTerminadas(pedido.piezas());
        actividad.setTerminada(true);
        actividad.setUltimoReporte(LocalDateTime.now());
        Actividad guardada = actividadRepository.save(actividad);

        // Si ya terminaron todas las actividades del pedido, el pedido pasa a Terminado
        boolean todasTerminadas = actividadRepository.findByPedidoId(actividad.getPedidoId()).stream()
                .allMatch(a -> Boolean.TRUE.equals(a.getTerminada()));
        boolean puedeTerminar = pedido.estado() != EstadoPedido.TERMINADO
                && pedido.estado() != EstadoPedido.ENTREGADO
                && pedido.estado() != EstadoPedido.CANCELADO;
        if (todasTerminadas && puedeTerminar) {
            pedido = pedidoService.cambiarEstado(actividad.getPedidoId(), EstadoPedido.TERMINADO);
        }

        return aAsignacion(guardada, pedido);
    }

    private boolean cubreElDia(Actividad a, LocalDate dia) {
        return !a.getFechaHoraInicio().toLocalDate().isAfter(dia)
                && !a.getFechaHoraFin().toLocalDate().isBefore(dia);
    }

    // También incluye las que se terminaron ayer
    private boolean terminadaElDiaAnterior(Actividad a, LocalDate dia) {
        return Boolean.TRUE.equals(a.getTerminada())
                && a.getUltimoReporte() != null
                && a.getUltimoReporte().toLocalDate().equals(dia.minusDays(1));
    }

    private void validarQueEsSuya(Actividad actividad, String empleadoId, boolean esDueno) {
        if (!esDueno && !Objects.equals(actividad.getEmpleadoId(), empleadoId)) {
            throw new NegocioException(CodigoError.ACTIVIDAD_NO_ASIGNADA);
        }
    }

    private PedidoDetalleDTO buscarPedidoOrNull(String pedidoId) {
        try {
            return pedidoService.obtenerDetalle(pedidoId);
        } catch (NegocioException e) {
            return null; // pedido borrado, la actividad no se muestra
        }
    }

    private AsignacionDTO aAsignacion(Actividad a, PedidoDetalleDTO p) {
        return new AsignacionDTO(
                a.getId(), a.getNombreActividad(), a.getFechaHoraInicio(), a.getFechaHoraFin(),
                p.id(), p.folio(), p.clienteNombre(), p.producto(), p.piezas(), p.fechaEntrega(), p.estado(),
                Objects.requireNonNullElse(a.getPiezasTerminadas(), 0),
                Objects.requireNonNullElse(a.getMerma(), 0),
                a.getMotivoMerma(), a.getObservaciones(), a.getUltimoReporte(),
                Boolean.TRUE.equals(a.getTerminada()));
    }

    private String textoONull(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }

    private Actividad obtenerActividad(String id) {
        return actividadRepository.findById(id)
                .orElseThrow(() -> new NegocioException(CodigoError.ACTIVIDAD_NO_ENCONTRADA));
    }
}
