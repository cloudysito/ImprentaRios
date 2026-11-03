package imprenta.sistema.imprentabackend.mantenimiento.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "maquinas")
public class Maquina {
    @Id
    private String id;
    private String nombre;
    private String descripcion;
    private String numeroSerie;
    private Integer anioOperacion;
    private String responsable;
    private int periodicidadDias; // días entre servicios preventivos
    private int horasUso;

    // Servicio programado con "Programar alerta". Se limpia al registrar el servicio
    private LocalDateTime alertaServicio;
}
