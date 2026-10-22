package imprenta.sistema.imprentabackend.pedidos.service.impl;

import imprenta.sistema.imprentabackend.pedidos.model.Producto;
import imprenta.sistema.imprentabackend.pedidos.repository.ProductoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.IProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductoService implements IProductoService {
    private final ProductoRepository productoRepository;

    @Override
    public Producto registrarProducto(Producto producto, String pedidoId){

        //Validaciones
        if(producto.getCantidad() <=0){
            throw new IllegalArgumentException("ERROR: La cantidad a producir NO debe ser 0");
        }

        if(producto.getMedidas() == null || producto.getMedidas().isEmpty()){
            throw new IllegalArgumentException("ERROR: La medidas a producir no deben ser null");
        }

        return producto;
    }
}
