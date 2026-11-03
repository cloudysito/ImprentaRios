package imprenta.sistema.imprentabackend.pedidos.mappers;

import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.model.ArchivoDisenio;

public final class ArchivoDisenioMapper {
    private ArchivoDisenioMapper() {
    }

    public static ArchivoDisenio toEntity(ArchivoDisenioRequestDTO dto) {
        ArchivoDisenio archivo = new ArchivoDisenio();
        actualizarEntidad(archivo, dto);
        return archivo;
    }

    public static void actualizarEntidad(ArchivoDisenio archivo, ArchivoDisenioRequestDTO dto) {
        archivo.setNombreArchivo(dto.nombreArchivo());
        archivo.setFechaRecepcion(dto.fechaRecepcion());
        archivo.setFechaEntrega(dto.fechaEntrega());
        archivo.setResolucion(dto.resolucion());
        archivo.setModoColor(dto.modoColor());
        archivo.setSangrado(dto.sangrado());
        archivo.setMedidaArchivo(dto.medidaArchivo());
        archivo.setCaras(dto.caras());
        archivo.setPrensa(dto.prensa());
        archivo.setVersion(dto.version());
    }

    public static ArchivoDisenioResponseDTO toResponse(ArchivoDisenio archivo) {
        return new ArchivoDisenioResponseDTO(
                archivo.getId(),
                archivo.getNombreArchivo(),
                archivo.getFechaRecepcion(),
                archivo.getFechaEntrega(),
                archivo.getResolucion(),
                archivo.getModoColor(),
                archivo.getSangrado(),
                archivo.getMedidaArchivo(),
                archivo.getCaras(),
                archivo.getPrensa(),
                archivo.getVersion()
        );
    }
}
