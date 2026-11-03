package imprenta.sistema.imprentabackend.calendarizacion.repository;

import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ActividadRepository extends MongoRepository<Actividad, String> {
    List<Actividad> findByEmpleadoId(String empleadoId);
    List<Actividad> findByPedidoId(String pedidoId);
}
