package imprenta.sistema.imprentabackend.pedidos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "archivos_disenio")
public class ArchivoDisenio {
    @Id
    private String id;
    private String nombreArchivo;
    private LocalDate fechaRecepcion;
    private LocalDate fechaEntrega;
    private Integer resolucion;
    private String modoColor;
    private Integer sangrado;
    private String medidaArchivo;
    private Integer caras;
    private String prensa;
    private Integer version;
}
