package imprenta.sistema.imprentabackend.inventario.repository;

import imprenta.sistema.imprentabackend.inventario.model.Insumo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InsumoRepository extends MongoRepository<Insumo, String> {
}
