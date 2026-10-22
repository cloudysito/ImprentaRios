package imprenta.sistema.imprentabackend.pedidos.repository;

import imprenta.sistema.imprentabackend.pedidos.model.Producto;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductoRepository extends MongoRepository<Producto, String>{
}