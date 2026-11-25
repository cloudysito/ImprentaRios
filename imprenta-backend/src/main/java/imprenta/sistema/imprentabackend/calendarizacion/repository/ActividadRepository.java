package imprenta.sistema.imprentabackend.calendarizacion.repository;

import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ActividadRepository extends MongoRepository<Actividad, String> {
    List<Actividad> findByEmpleadoId(String empleadoId);
    List<Actividad> findByPedidoId(String pedidoId);
    boolean existsByEmpleadoId(String empleadoId);
    void deleteByPedidoId(String pedidoId);

    // Reportes de avance hechos en un periodo (desde incluido, hasta excluido)
    List<Actividad> findByUltimoReporteGreaterThanEqualAndUltimoReporteLessThan(LocalDateTime desde, LocalDateTime hasta);
}
