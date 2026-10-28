package imprenta.sistema.imprentabackend.pedidos.dtos;

import imprenta.sistema.imprentabackend.pedidos.model.ArchivoDisenio;
import imprenta.sistema.imprentabackend.pedidos.model.Prioridad;
import imprenta.sistema.imprentabackend.pedidos.model.TipoAcabado;
import imprenta.sistema.imprentabackend.pedidos.model.TipoTinta;

import java.util.List;

public record ProductoResponseDTO(
        String id,
        int cantidad,
        String medidas,
        TipoTinta tinta,
        TipoAcabado tipoAcabado,
        Prioridad prioridad,
        String observaciones,
        String tipoProductoId,
        String materialId,
        List<ArchivoDisenio>archivosDisenio
) {
}
