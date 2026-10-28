package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.model.ArchivoDisenio;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;

public interface IArchivoDisenioService {
    ArchivoDisenioResponseDTO registrarArchivoDisenio(ArchivoDisenioRequestDTO dto);
    ArchivoDisenioResponseDTO actualizarArchivoDisenio(String id, ArchivoDisenioRequestDTO dto);
    ArchivoDisenioResponseDTO buscarArchivoDisenio(String id);
    void eliminarArchivoDisenio(String id);
}
