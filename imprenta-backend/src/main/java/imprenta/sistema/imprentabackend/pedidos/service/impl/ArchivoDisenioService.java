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

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArchivoDisenioService implements IArchivoDisenioService {
    private final ArchivoDisenioRepository archivoDisenioRepository;

    @Override
    public ArchivoDisenioResponseDTO registrarArchivoDisenio(ArchivoDisenioRequestDTO dto) {
        return ArchivoDisenioMapper.toResponse(
                archivoDisenioRepository.save(ArchivoDisenioMapper.toEntity(dto))
        );
    }

    @Override
    public ArchivoDisenioResponseDTO actualizarArchivoDisenio(String id, ArchivoDisenioRequestDTO dto) {
        ArchivoDisenio archivo = obtenerArchivoDisenio(id);
        ArchivoDisenioMapper.actualizarEntidad(archivo, dto);
        return ArchivoDisenioMapper.toResponse(archivoDisenioRepository.save(archivo));
    }

    @Override
    public ArchivoDisenioResponseDTO buscarArchivoDisenio(String id) {
        return ArchivoDisenioMapper.toResponse(obtenerArchivoDisenio(id));
    }

    @Override
    public List<ArchivoDisenioResponseDTO> listarArchivosDisenio() {
        return archivoDisenioRepository.findAll().stream()
                .map(ArchivoDisenioMapper::toResponse)
                .toList();
    }

    @Override
    public void eliminarArchivoDisenio(String id) {
        archivoDisenioRepository.delete(obtenerArchivoDisenio(id));
    }

    private ArchivoDisenio obtenerArchivoDisenio(String id) {
        return archivoDisenioRepository.findById(id)
                .orElseThrow(() -> new NegocioException(CodigoError.ARCHIVO_DE_DISENIO_NO_ENCONTRADO));
    }
}
