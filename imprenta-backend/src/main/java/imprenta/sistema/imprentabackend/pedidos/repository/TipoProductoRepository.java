package imprenta.sistema.imprentabackend.pedidos.repository;

import imprenta.sistema.imprentabackend.pedidos.model.TipoProducto;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TipoProductoRepository extends MongoRepository<TipoProducto, String> {
}
