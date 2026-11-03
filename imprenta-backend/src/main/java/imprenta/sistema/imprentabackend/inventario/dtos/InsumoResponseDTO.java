package imprenta.sistema.imprentabackend.inventario.dtos;

import imprenta.sistema.imprentabackend.inventario.model.TipoInsumo;

public record InsumoResponseDTO (
        String id,
        String nombre,
        TipoInsumo tipoInsumo,
        String unidad,
        int cantidadDisponible
){
}
