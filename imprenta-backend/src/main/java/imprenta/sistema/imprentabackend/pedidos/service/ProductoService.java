package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.pedidos.model.Producto;
import imprenta.sistema.imprentabackend.pedidos.repository.ProductoRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductoService {
    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

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
