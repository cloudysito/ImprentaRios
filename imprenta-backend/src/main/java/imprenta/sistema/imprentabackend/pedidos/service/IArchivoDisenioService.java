package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioResponseDTO;

import java.util.List;

public interface IArchivoDisenioService {
    ArchivoDisenioResponseDTO registrarArchivoDisenio(ArchivoDisenioRequestDTO dto);
    ArchivoDisenioResponseDTO actualizarArchivoDisenio(String id, ArchivoDisenioRequestDTO dto);
    ArchivoDisenioResponseDTO buscarArchivoDisenio(String id);
    List<ArchivoDisenioResponseDTO> listarArchivosDisenio();
    void eliminarArchivoDisenio(String id);
}
