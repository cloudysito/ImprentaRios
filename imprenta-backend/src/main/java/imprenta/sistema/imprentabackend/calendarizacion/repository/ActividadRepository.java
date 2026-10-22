package imprenta.sistema.imprentabackend.calendarizacion.repository;

import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ActividadRepository extends MongoRepository<Actividad, String> {
}
