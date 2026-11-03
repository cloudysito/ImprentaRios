package imprenta.sistema.imprentabackend.mantenimiento.service.impl;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.AlertaRequestDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.MaquinaDetalleDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.MaquinaRequestDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.MaquinaResumenDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.ServicioRequestDTO;
import imprenta.sistema.imprentabackend.mantenimiento.mapper.MantenimientoMapper;
import imprenta.sistema.imprentabackend.mantenimiento.model.EstatusMaquina;
import imprenta.sistema.imprentabackend.mantenimiento.model.Maquina;
import imprenta.sistema.imprentabackend.mantenimiento.model.ServicioMantenimiento;
import imprenta.sistema.imprentabackend.mantenimiento.repository.MaquinaRepository;
import imprenta.sistema.imprentabackend.mantenimiento.repository.ServicioMantenimientoRepository;
import imprenta.sistema.imprentabackend.mantenimiento.service.IMantenimientoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MantenimientoService implements IMantenimientoService {

    private final MaquinaRepository maquinaRepository;
    private final ServicioMantenimientoRepository servicioRepository;

    @Override
    public List<MaquinaResumenDTO> listarMaquinas() {
        return maquinaRepository.findAll().stream()
                .map(this::aDetalle)
                .sorted(Comparator.comparing(MaquinaDetalleDTO::nombre, String.CASE_INSENSITIVE_ORDER))
                .map(d -> new MaquinaResumenDTO(d.id(), d.nombre(), d.descripcion(),
                        d.proximoServicio(), d.servicioProgramado(), d.estatus()))
                .toList();
    }

    @Override
    public MaquinaDetalleDTO obtenerMaquina(String id) {
        return aDetalle(buscar(id));
    }

    @Override
    public MaquinaDetalleDTO registrarMaquina(MaquinaRequestDTO dto) {
        Maquina maquina = new Maquina();
        MantenimientoMapper.actualizarMaquina(maquina, dto);
        return aDetalle(maquinaRepository.save(maquina));
    }

    @Override
    public MaquinaDetalleDTO actualizarMaquina(String id, MaquinaRequestDTO dto) {
        Maquina maquina = buscar(id);
        MantenimientoMapper.actualizarMaquina(maquina, dto);
        return aDetalle(maquinaRepository.save(maquina));
    }

    @Override
    public void eliminarMaquina(String id) {
        Maquina maquina = buscar(id);
        servicioRepository.deleteByMaquinaId(id);
        maquinaRepository.delete(maquina);
    }

    @Override
    public MaquinaDetalleDTO registrarServicio(String maquinaId, ServicioRequestDTO dto) {
        Maquina maquina = buscar(maquinaId);
        servicioRepository.save(MantenimientoMapper.toServicio(maquinaId, dto));

        // Si había un servicio programado y ya se hizo, se quita la alerta
        if (maquina.getAlertaServicio() != null
                && !dto.fecha().isBefore(maquina.getAlertaServicio().toLocalDate().minusDays(7))) {
            maquina.setAlertaServicio(null);
            maquinaRepository.save(maquina);
        }
        return aDetalle(maquina);
    }

    @Override
    public MaquinaDetalleDTO programarAlerta(String maquinaId, AlertaRequestDTO dto) {
        Maquina maquina = buscar(maquinaId);
        maquina.setAlertaServicio(dto.fechaHora());
        return aDetalle(maquinaRepository.save(maquina));
    }

    /**
     * Próximo servicio = la alerta programada, o el último servicio + la periodicidad.
     * Atrasado si esa fecha ya pasó, Programado si hay alerta, En regla en otro caso.
     */
    private MaquinaDetalleDTO aDetalle(Maquina m) {
        List<ServicioMantenimiento> historial = servicioRepository.findByMaquinaIdOrderByFechaDesc(m.getId());
        LocalDate hoy = LocalDate.now();

        LocalDate ultimo = historial.isEmpty() ? null : historial.get(0).getFecha();
        LocalDateTime proximo = m.getAlertaServicio() != null
                ? m.getAlertaServicio()
                : ultimo != null ? ultimo.plusDays(m.getPeriodicidadDias()).atStartOfDay() : null;

        EstatusMaquina estatus;
        if (proximo != null && proximo.toLocalDate().isBefore(hoy)) {
            estatus = EstatusMaquina.ATRASADO;
        } else if (m.getAlertaServicio() != null) {
            estatus = EstatusMaquina.PROGRAMADO;
        } else {
            estatus = EstatusMaquina.EN_REGLA;
        }

        long serviciosEnAnio = historial.stream()
                .filter(s -> s.getFecha() != null && s.getFecha().getYear() == hoy.getYear())
                .count();

        return new MaquinaDetalleDTO(m.getId(), m.getNombre(), m.getDescripcion(), m.getNumeroSerie(),
                m.getAnioOperacion(), m.getResponsable(), m.getPeriodicidadDias(), m.getHorasUso(),
                ultimo, proximo, m.getAlertaServicio() != null, estatus, serviciosEnAnio,
                historial.stream().map(MantenimientoMapper::toResponse).toList());
    }

    private Maquina buscar(String id) {
        return maquinaRepository.findById(id)
                .orElseThrow(() -> new NegocioException(CodigoError.MAQUINA_NO_ENCONTRADA));
    }
}
