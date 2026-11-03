package imprenta.sistema.imprentabackend.inventario.service.impl;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.inventario.dtos.MaterialRequestDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.MaterialResponseDTO;
import imprenta.sistema.imprentabackend.inventario.mapper.MaterialMapper;
import imprenta.sistema.imprentabackend.inventario.model.Material;
import imprenta.sistema.imprentabackend.inventario.repository.InsumoRepository;
import imprenta.sistema.imprentabackend.inventario.repository.MaterialRepository;
import imprenta.sistema.imprentabackend.inventario.service.IMaterialService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService implements IMaterialService {
    private final MaterialRepository materialRepository;
    private final InsumoRepository insumoRepository;

    public MaterialService(MaterialRepository materialRepository, InsumoRepository insumoRepository) {
        this.materialRepository = materialRepository;
        this.insumoRepository = insumoRepository;
    }

    @Override
    public MaterialResponseDTO agregarMaterial(MaterialRequestDTO material) {
        validarInsumo(material.insumoId());
        Material guardado = materialRepository.save(MaterialMapper.toEntity(material));
        return MaterialMapper.toResponse(guardado);
    }

    @Override
    public List<MaterialResponseDTO> listarMateriales() {
        return materialRepository.findAll()
                .stream()
                .map(MaterialMapper::toResponse)
                .toList();
    }

    @Override
    public MaterialResponseDTO buscarMaterialPorId(String idMaterial) {
        Material material = materialRepository.findById(idMaterial)
                .orElseThrow(() -> new NegocioException(CodigoError.MATERIAL_NO_ENCONTRADO));

        return MaterialMapper.toResponse(material);
    }

    @Override
    public MaterialResponseDTO actualizarMaterial(String idMaterial, MaterialRequestDTO material) {
        Material materialExistente = materialRepository.findById(idMaterial)
                .orElseThrow(() -> new NegocioException(CodigoError.MATERIAL_NO_ENCONTRADO));

        validarInsumo(material.insumoId());
        MaterialMapper.actualizarEntidad(materialExistente, material);
        Material actualizado = materialRepository.save(materialExistente);
        return MaterialMapper.toResponse(actualizado);
    }

    @Override
    public void eliminarMaterialPorId(String idMaterial) {
        Material material = materialRepository.findById(idMaterial)
                .orElseThrow(() -> new NegocioException(CodigoError.MATERIAL_NO_ENCONTRADO));

        materialRepository.delete(material);
    }

    private void validarInsumo(String insumoId) {
        if (!insumoRepository.existsById(insumoId)) {
            throw new NegocioException(CodigoError.INSUMO_NO_ENCONTRADO);
        }
    }
}
