package imprenta.sistema.imprentabackend.pedidos.service.impl;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.mappers.ArchivoDisenioMapper;
import imprenta.sistema.imprentabackend.pedidos.model.ArchivoDisenio;
import imprenta.sistema.imprentabackend.pedidos.repository.ArchivoDisenioRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.IArchivoDisenioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArchivoDisenioService implements IArchivoDisenioService {
    private final ArchivoDisenioRepository archivoDisenioRepository;
    private final PedidoRepository pedidoRepository;

    @Override
    public ArchivoDisenioResponseDTO registrarArchivoDisenio(ArchivoDisenioRequestDTO dto) {
        ArchivoDisenio archivo = ArchivoDisenioMapper.toEntity(dto);
        String grupoId = resolverGrupoId(dto.grupoId());

        if (grupoId == null) {
            archivo.setVersion(1);
            archivo.setGrupoId(null);
        } else {
            archivo.setVersion(siguienteVersion(grupoId));
            archivo.setGrupoId(grupoId);
        }

        return ArchivoDisenioMapper.toResponse(
                archivoDisenioRepository.save(archivo)
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
        ArchivoDisenio archivo = obtenerArchivoDisenio(id);
        if (pedidoRepository.existsByArchivoDisenioId(id)
                || pedidoRepository.existsByArchivosDisenioIdsContaining(id)) {
            throw new NegocioException(CodigoError.ARCHIVO_DE_DISENIO_EN_USO);
        }
        archivoDisenioRepository.delete(archivo);
    }

    private String resolverGrupoId(String grupoIdSolicitado) {
        if (grupoIdSolicitado == null || grupoIdSolicitado.isBlank()) {
            return null;
        }
        return archivoDisenioRepository.findById(grupoIdSolicitado)
                .map(raiz -> raiz.getGrupoId() == null ? raiz.getId() : raiz.getGrupoId())
                .orElseGet(() -> {
                    if (archivoDisenioRepository.findByGrupoId(grupoIdSolicitado).isEmpty()) {
                        throw new NegocioException(CodigoError.ARCHIVO_DE_DISENIO_NO_ENCONTRADO);
                    }
                    return grupoIdSolicitado;
                });
    }

    private int siguienteVersion(String grupoId) {
        int mayor = archivoDisenioRepository.findById(grupoId)
                .map(archivo -> archivo.getVersion() == null ? 1 : archivo.getVersion())
                .orElse(0);

        for (ArchivoDisenio version : archivoDisenioRepository.findByGrupoId(grupoId)) {
            if (version.getVersion() != null) {
                mayor = Math.max(mayor, version.getVersion());
            }
        }

        return mayor + 1;
    }

    private ArchivoDisenio obtenerArchivoDisenio(String id) {
        return archivoDisenioRepository.findById(id)
                .orElseThrow(() -> new NegocioException(CodigoError.ARCHIVO_DE_DISENIO_NO_ENCONTRADO));
    }
}
