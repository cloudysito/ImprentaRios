package imprenta.sistema.imprentabackend.pedidos.mappers;

import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.model.ArchivoDisenio;

public final class ArchivoDisenioMapper {
    private ArchivoDisenioMapper() {}

    public static ArchivoDisenio toEntity(ArchivoDisenioRequestDTO dto){
        ArchivoDisenio archivoDisenio = new ArchivoDisenio();
        actualizarEntidad(archivoDisenio, dto);
        return archivoDisenio;
    }

    public static void actualizarEntidad(ArchivoDisenio archivoDisenio, ArchivoDisenioRequestDTO dto){
        archivoDisenio.setRutaArchivo(dto.rutaArchivo());
    }

    public static ArchivoDisenioResponseDTO toResponse(ArchivoDisenio archivoDisenio){
        return new ArchivoDisenioResponseDTO(
                archivoDisenio.getRutaArchivo()
        );
    }
}
