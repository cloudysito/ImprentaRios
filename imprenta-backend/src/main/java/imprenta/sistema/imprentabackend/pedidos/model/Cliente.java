package imprenta.sistema.imprentabackend.pedidos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "clientes")
public class Cliente {
    @Id
    private String id;
    private String nombre;
    private String telefono;
    private String correo;
}
