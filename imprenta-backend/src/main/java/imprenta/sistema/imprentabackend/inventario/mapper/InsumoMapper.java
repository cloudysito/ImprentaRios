package imprenta.sistema.imprentabackend.inventario.mapper;

import imprenta.sistema.imprentabackend.inventario.dtos.InsumoRequestDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.InsumoResponseDTO;
import imprenta.sistema.imprentabackend.inventario.model.Insumo;

public final class InsumoMapper {

    private InsumoMapper() {
    }

    public static Insumo toEntity(InsumoRequestDTO dto) {
        Insumo insumo = new Insumo();
        actualizarEntidad(insumo, dto);
        return insumo;
    }

    public static void actualizarEntidad(
            Insumo insumo,
            InsumoRequestDTO dto
    ) {
        insumo.setNombre(dto.nombre());
        insumo.setTipo(dto.tipoInsumo());
        insumo.setUnidad(dto.unidad());
        insumo.setCantidadDisponible(dto.cantidadDisponible());
    }

    public static InsumoResponseDTO toResponse(Insumo insumo) {
        return new InsumoResponseDTO(
                insumo.getId(),
                insumo.getNombre(),
                insumo.getTipo(),
                insumo.getUnidad(),
                insumo.getCantidadDisponible()
        );
    }
}