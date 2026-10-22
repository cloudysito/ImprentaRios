package imprenta.sistema.imprentabackend.pedidos.repository;

import imprenta.sistema.imprentabackend.pedidos.model.Cliente;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClienteRepository extends MongoRepository<Cliente, String> {
}
