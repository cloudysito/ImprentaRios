package imprenta.sistema.imprentabackend.pedidos.service.impl;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.mappers.PedidoMapper;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.IPedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class PedidoService implements IPedidoService {
    private final PedidoRepository pedidoRepository;

    @Override
    public PedidoResponseDTO capturarPedido(PedidoRequestDTO dto) {
        Pedido guardado = pedidoRepository.save(PedidoMapper.toEntity(dto));
        return PedidoMapper.toResponse(guardado);
    }

    @Override
    public void eliminarPedido(String id) {
        pedidoRepository.delete(obtenerPedido(id));
    }

    @Override
    public PedidoResponseDTO actualizarPedido(String id, PedidoRequestDTO dto) {
        Pedido pedido = obtenerPedido(id);
        PedidoMapper.actualizarEntidad(pedido, dto);
        return PedidoMapper.toResponse(pedidoRepository.save(pedido));
    }

    @Override
    public PedidoResponseDTO buscarPedido(String id) {
        return PedidoMapper.toResponse(obtenerPedido(id));
    }

    private Pedido obtenerPedido(String id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new NegocioException(CodigoError.PEDIDO_NO_ENCONTRADO));
    }
}
