package imprenta.sistema.imprentabackend.inventario.mapper;

import imprenta.sistema.imprentabackend.inventario.dtos.InsumoRequestDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.InsumoResponseDTO;
import imprenta.sistema.imprentabackend.inventario.model.EstatusStock;
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
        insumo.setPuntoReorden(dto.puntoReorden());
    }

    public static InsumoResponseDTO toResponse(Insumo insumo) {
        return new InsumoResponseDTO(
                insumo.getId(),
                insumo.getNombre(),
                insumo.getTipo(),
                insumo.getUnidad(),
                insumo.getCantidadDisponible(),
                insumo.getPuntoReorden(),
                insumo.getUltimaEntrada(),
                calcularEstatus(insumo.getCantidadDisponible(), insumo.getPuntoReorden())
        );
    }

    /**
     * Debajo del punto de reorden es desabasto.
     * Hasta 50 % arriba del punto se considera por agotarse.
     */
    public static EstatusStock calcularEstatus(int cantidad, int puntoReorden) {
        if (puntoReorden <= 0) {
            return cantidad > 0 ? EstatusStock.SUFICIENTE : EstatusStock.DESABASTO;
        }
        if (cantidad < puntoReorden) {
            return EstatusStock.DESABASTO;
        }
        if (cantidad < puntoReorden * 1.5) {
            return EstatusStock.POR_AGOTARSE;
        }
        return EstatusStock.SUFICIENTE;
    }
}
