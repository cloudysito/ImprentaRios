package imprenta.sistema.imprentabackend.pedidos.repository;

import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PedidoRepository extends MongoRepository<Pedido, String> {
}
