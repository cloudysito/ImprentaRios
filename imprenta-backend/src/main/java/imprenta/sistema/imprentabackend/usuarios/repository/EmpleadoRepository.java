package imprenta.sistema.imprentabackend.usuarios.repository;

import imprenta.sistema.imprentabackend.pedidos.model.Cliente;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EmpleadoRepository extends MongoRepository<Cliente, String> {
}
