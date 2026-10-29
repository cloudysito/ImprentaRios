package imprenta.sistema.imprentabackend.inventario.service;

import imprenta.sistema.imprentabackend.inventario.dtos.MaterialRequestDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.MaterialResponseDTO;

import java.util.List;

public interface IMaterialService {
    MaterialResponseDTO agregarMaterial(MaterialRequestDTO material);
    List<MaterialResponseDTO> listarMateriales();
    MaterialResponseDTO buscarMaterialPorId(String idMaterial);
    MaterialResponseDTO actualizarMaterial(String idMaterial, MaterialRequestDTO material);
    void eliminarMaterialPorId(String idMaterial);
}
