package imprenta.sistema.imprentabackend.inventario.service.impl;

import imprenta.sistema.imprentabackend.inventario.dtos.InsumoRequestDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.InsumoResponseDTO;
import imprenta.sistema.imprentabackend.inventario.mapper.InsumoMapper;
import imprenta.sistema.imprentabackend.inventario.model.Insumo;
import imprenta.sistema.imprentabackend.inventario.repository.InsumoRepository;
import imprenta.sistema.imprentabackend.inventario.service.IInsumoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InsumoService implements IInsumoService {
    private final InsumoRepository insumoRepository;

    @Override
    public InsumoResponseDTO agregarInsumo(InsumoRequestDTO dto) {
        Insumo guardado = insumoRepository.save(InsumoMapper.toEntity(dto));
        return InsumoMapper.toResponse(guardado);
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
        Insumo insumo = insumoRepository.findById(idInsumo)
                .orElseThrow(() -> new NegocioException(CodigoError.INSUMO_NO_ENCONTRADO));

        return InsumoMapper.toResponse(insumo);
    }

    @Override
    public InsumoResponseDTO actualizarInsumo(String idInsumo, InsumoRequestDTO dto) {
        Insumo insumo = insumoRepository.findById(idInsumo)
                .orElseThrow(() -> new NegocioException(CodigoError.INSUMO_NO_ENCONTRADO));

        InsumoMapper.actualizarEntidad(insumo, dto);
        Insumo actualizado = insumoRepository.save(insumo);
        return InsumoMapper.toResponse(actualizado);
    }

    @Override
    public void eliminarInsumoPorId(String idInsumo) {
        Insumo insumo = insumoRepository.findById(idInsumo)
                .orElseThrow(() -> new NegocioException(CodigoError.INSUMO_NO_ENCONTRADO));

        insumoRepository.delete(insumo);
    }
}
