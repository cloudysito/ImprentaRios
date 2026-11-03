package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoDetalleDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoResumenDTO;
import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;

import java.util.List;

public interface IPedidoService {

    PedidoResponseDTO capturarPedido(PedidoRequestDTO dto, String empleadoId);
    void eliminarPedido(String id);
    PedidoResponseDTO actualizarPedido(String id, PedidoRequestDTO dto);
    PedidoResponseDTO buscarPedido(String id);

    // Pantalla "Gestionar pedidos"
    List<PedidoResumenDTO> listarPedidos();
    PedidoDetalleDTO obtenerDetalle(String id);
    PedidoDetalleDTO cambiarEstado(String id, EstadoPedido nuevoEstado);

}
