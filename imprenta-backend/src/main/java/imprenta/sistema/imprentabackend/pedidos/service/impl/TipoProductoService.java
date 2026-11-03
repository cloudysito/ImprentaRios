package imprenta.sistema.imprentabackend.pedidos.service.impl;

import imprenta.sistema.imprentabackend.pedidos.model.TipoProducto;
import imprenta.sistema.imprentabackend.pedidos.repository.TipoProductoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.ITipoProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoProductoService implements ITipoProductoService {
    private final TipoProductoRepository tipoProductoRepository;

    @Override
    public List<TipoProducto> listar() {
        return tipoProductoRepository.findAll();
    }
}
