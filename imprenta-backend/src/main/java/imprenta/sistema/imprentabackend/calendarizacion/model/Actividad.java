package imprenta.sistema.imprentabackend.calendarizacion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "actividades")
public class Actividad {
    @Id
    private String id;
    private String nombreActividad;
    private String descripcion;
    private Date fechaHoraInicio;
    private Date fechaHoraFin;
}
