package imprenta.sistema.imprentabackend.inventario.repository;

import imprenta.sistema.imprentabackend.inventario.model.MovimientoInventario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface MovimientoInventarioRepository extends MongoRepository<MovimientoInventario, String> {
    // En Mongo "Between" no incluye los extremos
    List<MovimientoInventario> findByFechaBetweenOrderByFechaDesc(LocalDate despuesDe, LocalDate antesDe);
}
