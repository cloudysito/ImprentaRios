package imprenta.sistema.imprentabackend.inventario.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "materiales")
public class Material {
    @Id
    private String id;
    private String nombre;
    private int gramaje;
    private String insumoId;
}
