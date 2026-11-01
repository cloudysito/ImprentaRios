package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioResponseDTO;

public interface IArchivoDisenioService {
    ArchivoDisenioResponseDTO registrarArchivoDisenio(ArchivoDisenioRequestDTO dto);
    ArchivoDisenioResponseDTO actualizarArchivoDisenio(String id, ArchivoDisenioRequestDTO dto);
    ArchivoDisenioResponseDTO buscarArchivoDisenio(String id);
    void eliminarArchivoDisenio(String id);
}
