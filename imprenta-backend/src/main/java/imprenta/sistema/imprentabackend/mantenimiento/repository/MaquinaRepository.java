package imprenta.sistema.imprentabackend.mantenimiento.repository;

import imprenta.sistema.imprentabackend.mantenimiento.model.Maquina;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MaquinaRepository extends MongoRepository<Maquina, String> {
}
