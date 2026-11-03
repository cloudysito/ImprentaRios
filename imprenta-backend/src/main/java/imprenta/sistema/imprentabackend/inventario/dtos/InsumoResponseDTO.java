package imprenta.sistema.imprentabackend.inventario.dtos;

import imprenta.sistema.imprentabackend.inventario.model.EstatusStock;
import imprenta.sistema.imprentabackend.inventario.model.TipoInsumo;

import java.time.LocalDate;

public record InsumoResponseDTO (
        String id,
        String nombre,
        TipoInsumo tipoInsumo,
        String unidad,
        int cantidadDisponible,
        int puntoReorden,
        LocalDate ultimaEntrada,
        EstatusStock estatus
){
}
