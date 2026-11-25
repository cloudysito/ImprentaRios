package imprenta.sistema.imprentabackend.pedidos.service.impl;

import imprenta.sistema.imprentabackend.pedidos.model.TipoProducto;
import imprenta.sistema.imprentabackend.pedidos.repository.TipoProductoRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.ITipoProductoService;
import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoProductoService implements ITipoProductoService {
    private final TipoProductoRepository tipoProductoRepository;
    private final PedidoRepository pedidoRepository;

    @Override
    public List<TipoProducto> listar() {
        return tipoProductoRepository.findAll();
    }

    @Override
    public void eliminar(String id) {
        TipoProducto tipo = tipoProductoRepository.findById(id)
                .orElseThrow(() -> new NegocioException(CodigoError.TIPO_PRODUCTO_NO_ENCONTRADO));
        if (pedidoRepository.existsByProductosTipoProductoId(id)) {
            throw new NegocioException(CodigoError.TIPO_PRODUCTO_EN_USO);
        }
        tipoProductoRepository.delete(tipo);
    }
}
