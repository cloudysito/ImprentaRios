package imprenta.sistema.imprentabackend.pedidos.service.impl;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.mappers.ArchivoDisenioMapper;
import imprenta.sistema.imprentabackend.pedidos.model.ArchivoDisenio;
import imprenta.sistema.imprentabackend.pedidos.repository.ArchivoDisenioRepository;
import imprenta.sistema.imprentabackend.pedidos.service.IArchivoDisenioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArchivoDisenioService implements IArchivoDisenioService {

    private final ArchivoDisenioRepository archivoDisenioRepository;

    @Override
    public ArchivoDisenioResponseDTO registrarArchivoDisenio(ArchivoDisenioRequestDTO dto) {
        ArchivoDisenio registrado = archivoDisenioRepository.save(ArchivoDisenioMapper.toEntity(dto));
        return ArchivoDisenioMapper.toResponse(registrado);
    }

    @Override
    public ArchivoDisenioResponseDTO actualizarArchivoDisenio(String id, ArchivoDisenioRequestDTO dto) {
        ArchivoDisenio archivoDisenio = obtenerArchivoDisenio(id);
        ArchivoDisenioMapper.actualizarEntidad(archivoDisenio, dto);
        return ArchivoDisenioMapper.toResponse(archivoDisenioRepository.save(archivoDisenio));
    }

    @Override
    public void eliminarArchivoDisenio(String id){
        archivoDisenioRepository.delete(obtenerArchivoDisenio(id));
    }

    @Override
    public ArchivoDisenioResponseDTO buscarArchivoDisenio(String id) {
        return ArchivoDisenioMapper.toResponse(obtenerArchivoDisenio(id));
    }
    private ArchivoDisenio obtenerArchivoDisenio(String id){
        return archivoDisenioRepository.findById(id)
                .orElseThrow(() -> new NegocioException(CodigoError.ARCHIVO_DE_DISENIO_NO_ENCONTRADO));
    }
}
