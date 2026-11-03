package imprenta.sistema.imprentabackend.pedidos.repository;

import imprenta.sistema.imprentabackend.pedidos.model.ArchivoDisenio;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ArchivoDisenioRepository extends MongoRepository<ArchivoDisenio, String> {
}
