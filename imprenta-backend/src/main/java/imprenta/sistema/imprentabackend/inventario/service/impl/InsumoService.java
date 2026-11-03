package imprenta.sistema.imprentabackend.inventario.service.impl;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.inventario.dtos.InsumoRequestDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.InsumoResponseDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.MovimientoRequestDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.MovimientoResponseDTO;
import imprenta.sistema.imprentabackend.inventario.mapper.InsumoMapper;
import imprenta.sistema.imprentabackend.inventario.model.Insumo;
import imprenta.sistema.imprentabackend.inventario.model.MovimientoInventario;
import imprenta.sistema.imprentabackend.inventario.model.TipoMovimiento;
import imprenta.sistema.imprentabackend.inventario.repository.InsumoRepository;
import imprenta.sistema.imprentabackend.inventario.repository.MovimientoInventarioRepository;
import imprenta.sistema.imprentabackend.inventario.service.IInsumoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class InsumoService implements IInsumoService {

    private final InsumoRepository insumoRepository;
    private final MovimientoInventarioRepository movimientoRepository;

    @Override
    public InsumoResponseDTO agregarInsumo(InsumoRequestDTO dto) {
        Insumo insumo = InsumoMapper.toEntity(dto);
        if (dto.cantidadDisponible() > 0) {
            insumo.setUltimaEntrada(LocalDate.now()); // la existencia inicial cuenta como entrada
        }
        return InsumoMapper.toResponse(insumoRepository.save(insumo));
    }

    @Override
    public List<InsumoResponseDTO> listarInsumos() {
        return insumoRepository.findAll()
                .stream()
                .map(InsumoMapper::toResponse)
                .toList();
    }

    @Override
    public InsumoResponseDTO buscarInsumoPorId(String idInsumo) {
        return InsumoMapper.toResponse(obtenerInsumo(idInsumo));
    }

    @Override
    public InsumoResponseDTO actualizarInsumo(String idInsumo, InsumoRequestDTO dto) {
        Insumo insumo = obtenerInsumo(idInsumo);
        InsumoMapper.actualizarEntidad(insumo, dto);
        return InsumoMapper.toResponse(insumoRepository.save(insumo));
    }

    @Override
    public void eliminarInsumoPorId(String idInsumo) {
        insumoRepository.delete(obtenerInsumo(idInsumo));
    }

    @Override
    public InsumoResponseDTO registrarMovimiento(String idInsumo, MovimientoRequestDTO dto, String empleadoId) {
        Insumo insumo = obtenerInsumo(idInsumo);

        if (dto.tipo() == TipoMovimiento.SALIDA) {
            if (dto.cantidad() > insumo.getCantidadDisponible()) {
                throw new NegocioException(CodigoError.INVENTARIO_INSUFICIENTE);
            }
            insumo.setCantidadDisponible(insumo.getCantidadDisponible() - dto.cantidad());
        } else {
            insumo.setCantidadDisponible(insumo.getCantidadDisponible() + dto.cantidad());
            if (insumo.getUltimaEntrada() == null || dto.fecha().isAfter(insumo.getUltimaEntrada())) {
                insumo.setUltimaEntrada(dto.fecha());
            }
        }

        Insumo guardado = insumoRepository.save(insumo);
        movimientoRepository.save(new MovimientoInventario(
                null, idInsumo, dto.tipo(), dto.cantidad(), dto.fecha(),
                dto.motivo().trim(), empleadoId, LocalDateTime.now()));

        return InsumoMapper.toResponse(guardado);
    }

    @Override
    public List<MovimientoResponseDTO> listarMovimientos(LocalDate desde, LocalDate hasta) {
        LocalDate fin = hasta != null ? hasta : LocalDate.now();
        LocalDate inicio = desde != null ? desde : fin.withDayOfMonth(1);

        Map<String, String> nombres = new HashMap<>();
        insumoRepository.findAll()
                .forEach(i -> nombres.put(i.getId(), Objects.requireNonNullElse(i.getNombre(), "")));

        return movimientoRepository.findByFechaBetweenOrderByFechaDesc(inicio.minusDays(1), fin.plusDays(1))
                .stream()
                .map(m -> new MovimientoResponseDTO(m.getId(), m.getInsumoId(),
                        nombres.getOrDefault(m.getInsumoId(), "Insumo eliminado"),
                        m.getTipo(), m.getCantidad(), m.getFecha(), m.getMotivo()))
                .toList();
    }

    private Insumo obtenerInsumo(String idInsumo) {
        return insumoRepository.findById(idInsumo)
                .orElseThrow(() -> new NegocioException(CodigoError.INSUMO_NO_ENCONTRADO));
    }
}
