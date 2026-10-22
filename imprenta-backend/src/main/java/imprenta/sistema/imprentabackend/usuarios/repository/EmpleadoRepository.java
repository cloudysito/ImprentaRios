package imprenta.sistema.imprentabackend.usuarios.repository;

import imprenta.sistema.imprentabackend.usuarios.model.Empleado;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EmpleadoRepository extends MongoRepository<Empleado, String> {
}
