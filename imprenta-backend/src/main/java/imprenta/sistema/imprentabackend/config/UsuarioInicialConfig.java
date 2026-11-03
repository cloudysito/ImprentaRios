package imprenta.sistema.imprentabackend.config;

import imprenta.sistema.imprentabackend.usuarios.model.Empleado;
import imprenta.sistema.imprentabackend.usuarios.model.Rol;
import imprenta.sistema.imprentabackend.usuarios.repository.EmpleadoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

// Crea usuarios iniciales al arrancar el backend si todavía no existen en la base.
// Los datos salen del .env. Si la contraseña de un usuario está vacía, ese usuario no se crea.
@Configuration
public class UsuarioInicialConfig {

    private static final Logger log = LoggerFactory.getLogger(UsuarioInicialConfig.class);

    @Bean
    public CommandLineRunner crearUsuariosIniciales(
            EmpleadoRepository empleadoRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.usuario:admin}") String adminUsuario,
            @Value("${app.admin.password:}") String adminPassword,
            @Value("${app.admin.nombre:Administrador}") String adminNombre,
            @Value("${app.secretaria.usuario:secretaria}") String secretariaUsuario,
            @Value("${app.secretaria.password:}") String secretariaPassword,
            @Value("${app.secretaria.nombre:Secretaria de pruebas}") String secretariaNombre
    ) {
        return args -> {
            crearSiNoExiste(empleadoRepository, passwordEncoder, adminUsuario, adminPassword, adminNombre, Rol.DUENO);
            crearSiNoExiste(empleadoRepository, passwordEncoder, secretariaUsuario, secretariaPassword, secretariaNombre, Rol.SECRETARIA);
        };
    }

    private void crearSiNoExiste(
            EmpleadoRepository empleadoRepository,
            PasswordEncoder passwordEncoder,
            String usuario,
            String password,
            String nombre,
            Rol rol
    ) {
        if (password == null || password.isBlank()) {
            log.info("No se creó el usuario inicial con rol {} porque su contraseña está vacía en el .env", rol);
            return;
        }
        if (empleadoRepository.existsByUsuario(usuario)) {
            return;
        }

        Empleado empleado = new Empleado();
        empleado.setNombre(nombre);
        empleado.setUsuario(usuario);
        empleado.setPassword(passwordEncoder.encode(password));
        empleado.setRol(rol);
        empleado.setActivo(true);
        empleadoRepository.save(empleado);

        log.info("Usuario inicial '{}' creado con rol {}", usuario, rol);
    }
}
