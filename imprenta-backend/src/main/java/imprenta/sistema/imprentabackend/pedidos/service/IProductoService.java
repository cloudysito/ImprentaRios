package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.pedidos.model.Producto;

public interface IProductoService {
    Producto registrarProducto(Producto producto, String pedidoId);
}
