package imprenta.sistema.imprentabackend.usuarios.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "empleados")
public class Empleado {
    @Id
    private String id;
    private String nombre;
    private String usuario;
    private String password;
    private Rol rol;
    private Boolean activo;
}
