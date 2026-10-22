package imprenta.sistema.imprentabackend.pedidos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "archivos_disenio")
public class ArchivoDisenio {
    @Id
    private String id;
    private String rutaArchivo;
}
