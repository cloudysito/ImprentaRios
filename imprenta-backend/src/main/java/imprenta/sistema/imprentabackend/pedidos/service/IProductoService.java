package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.pedidos.dtos.ProductoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ProductoResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.model.Producto;

public interface IProductoService {
    ProductoResponseDTO registrarProducto(ProductoRequestDTO dto);
    void eliminarProducto(String id);
    ProductoResponseDTO actualizarProducto(String id, ProductoRequestDTO dto);
    ProductoResponseDTO buscarProducto(String id);
}
