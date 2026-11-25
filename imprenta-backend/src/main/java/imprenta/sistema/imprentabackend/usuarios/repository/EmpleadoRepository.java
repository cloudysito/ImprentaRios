package imprenta.sistema.imprentabackend.usuarios.repository;

import imprenta.sistema.imprentabackend.usuarios.model.Empleado;
import imprenta.sistema.imprentabackend.usuarios.model.Rol;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EmpleadoRepository extends MongoRepository<Empleado, String> {
    Empleado findByUsuario(String usuario);
    boolean existsByUsuario(String usuario);
    long countByRolAndActivo(Rol rol, Boolean activo);
}
