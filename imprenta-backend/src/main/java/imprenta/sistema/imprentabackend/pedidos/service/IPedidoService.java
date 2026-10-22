package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.pedidos.model.Cliente;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;

public interface IPedidoService {

    Pedido capturarPedido(Pedido pedido, Cliente cliente, String insumoId, int cantidadDisponible);
    Pedido actualizarPedido(Pedido pedido, String id) throws Exception;

}
