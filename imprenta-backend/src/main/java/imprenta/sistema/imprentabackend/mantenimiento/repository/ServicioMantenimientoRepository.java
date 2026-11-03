package imprenta.sistema.imprentabackend.mantenimiento.repository;

import imprenta.sistema.imprentabackend.mantenimiento.model.ServicioMantenimiento;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ServicioMantenimientoRepository extends MongoRepository<ServicioMantenimiento, String> {
    List<ServicioMantenimiento> findByMaquinaIdOrderByFechaDesc(String maquinaId);
    void deleteByMaquinaId(String maquinaId);
}
