package imprenta.sistema.imprentabackend.inventario.repository;

import imprenta.sistema.imprentabackend.inventario.model.Material;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MaterialRepository extends MongoRepository<Material, String> {
}
