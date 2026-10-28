package imprenta.sistema.imprentabackend.pedidos.service.impl;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.inventario.repository.MaterialRepository;
import imprenta.sistema.imprentabackend.pedidos.dtos.ProductoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ProductoResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.mappers.ProductoMapper;
import imprenta.sistema.imprentabackend.pedidos.model.Producto;
import imprenta.sistema.imprentabackend.pedidos.repository.ProductoRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.TipoProductoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.IProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductoService implements IProductoService {
    private final ProductoRepository productoRepository;
    private final TipoProductoRepository tipoProductoRepository;
    private final MaterialRepository materialRepository;

    @Override
    public ProductoResponseDTO registrarProducto(ProductoRequestDTO dto) {
        Producto guardado = productoRepository.save(ProductoMapper.toEntity(dto));
        return ProductoMapper.toResponse(guardado);
    }

    @Override
    public void eliminarProducto(String id) {
        productoRepository.delete(obtenerProducto(id));
    }

    @Override
    public ProductoResponseDTO actualizarProducto(String id, ProductoRequestDTO dto) {
        Producto producto = obtenerProducto(id);
        validarRelaciones(dto.tipoProductoId(), dto.materialId());
        ProductoMapper.actualizarEntidad(producto, dto);
        return ProductoMapper.toResponse(productoRepository.save(producto));
    }

    @Override
    public ProductoResponseDTO buscarProducto(String id) {
        return ProductoMapper.toResponse(obtenerProducto(id));
    }

    private Producto obtenerProducto(String id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new NegocioException(CodigoError.PRODUCTO_NO_ENCONTRADO));
    }

    private void validarRelaciones(String tipoProductoId, String materialId) {
        if (!tipoProductoRepository.existsById(tipoProductoId)) {
            throw new NegocioException(CodigoError.TIPO_PRODUCTO_NO_ENCONTRADO);
        }
        if (!materialRepository.existsById(materialId)) {
            throw new NegocioException(CodigoError.MATERIAL_NO_ENCONTRADO);
        }
    }
}
