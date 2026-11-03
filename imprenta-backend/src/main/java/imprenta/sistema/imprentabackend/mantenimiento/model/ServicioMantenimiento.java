package imprenta.sistema.imprentabackend.mantenimiento.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "servicios_mantenimiento")
public class ServicioMantenimiento {
    @Id
    private String id;
    private String maquinaId;
    private TipoServicio tipo;
    private LocalDate fecha;
    private String tecnico;
    private Double paroEstimadoHoras;
    private String refacciones;
    private String notas;
}
