package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoResponseDTO;

public interface IPedidoService {

    PedidoResponseDTO capturarPedido(PedidoRequestDTO dto);
    void eliminarPedido(String id);
    PedidoResponseDTO actualizarPedido(String id, PedidoRequestDTO dto);
    PedidoResponseDTO buscarPedido(String id);

}
