package imprenta.sistema.imprentabackend.inventario.mapper;

import imprenta.sistema.imprentabackend.inventario.dtos.MaterialRequestDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.MaterialResponseDTO;
import imprenta.sistema.imprentabackend.inventario.model.Material;

public final class MaterialMapper {
    private MaterialMapper(){ }

    public static Material toEntity(MaterialRequestDTO dto) {
        Material material = new Material();
        actualizarEntidad(material, dto);
        return material;
    }

    public static void actualizarEntidad(
            Material material,
            MaterialRequestDTO dto
    ) {
        material.setNombre(dto.nombre());
        material.setGramaje(dto.gramaje());
        material.setInsumoId(dto.insumoId());
    }

    public static MaterialResponseDTO toResponse(Material material) {
        return new MaterialResponseDTO(
                material.getId(),
                material.getNombre(),
                material.getGramaje(),
                material.getInsumoId()
        );
    }

}
