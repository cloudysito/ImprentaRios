package imprenta.sistema.imprentabackend.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(s ->
                        s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // Rutas públicas
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/empleados/login", "/error").permitAll()

                        // Empleados: sólo el dueño
                        .requestMatchers("/api/empleados/**")
                        .hasRole("DUENO")

                        // Cambiar estado: dueño, secretaria y manufactura
                        .requestMatchers(HttpMethod.PATCH, "/api/pedidos/*/estado")
                        .hasAnyRole("DUENO", "SECRETARIA", "MANUFACTURA")

                        // Pedidos: consultar
                        .requestMatchers(HttpMethod.GET, "/api/pedidos/**")
                        .hasAnyRole("DUENO", "SECRETARIA", "DISENADOR", "MANUFACTURA")

                        // Pedidos: crear y editar
                        .requestMatchers(HttpMethod.POST, "/api/pedidos")
                        .hasAnyRole("DUENO", "SECRETARIA")

                        .requestMatchers(HttpMethod.PUT, "/api/pedidos/*")
                        .hasAnyRole("DUENO", "SECRETARIA")

                        // Pedidos: eliminar
                        .requestMatchers(HttpMethod.DELETE, "/api/pedidos/*")
                        .hasRole("DUENO")

                        // Clientes
                        .requestMatchers(HttpMethod.GET, "/api/cliente", "/api/cliente/*")
                        .hasAnyRole("DUENO", "SECRETARIA")

                        .requestMatchers(HttpMethod.POST, "/api/cliente")
                        .hasAnyRole("DUENO", "SECRETARIA")

                        .requestMatchers(HttpMethod.PUT, "/api/cliente/*")
                        .hasAnyRole("DUENO", "SECRETARIA")

                        .requestMatchers(HttpMethod.DELETE, "/api/cliente/*")
                        .hasRole("DUENO")

                        // Archivos de diseño
                        .requestMatchers(HttpMethod.GET, "/api/archivo_disenio", "/api/archivo_disenio/*")
                        .hasAnyRole("DUENO", "SECRETARIA", "DISENADOR", "MANUFACTURA")

                        .requestMatchers(HttpMethod.POST, "/api/archivo_disenio")
                        .hasAnyRole("DUENO", "DISENADOR")

                        .requestMatchers(HttpMethod.PUT, "/api/archivo_disenio/*")
                        .hasAnyRole("DUENO", "DISENADOR")

                        .requestMatchers(HttpMethod.DELETE, "/api/archivo_disenio/*")
                        .hasAnyRole("DUENO", "DISENADOR")

                        // Inventario
                        .requestMatchers(HttpMethod.GET, "/api/insumo", "/api/insumo/*")
                        .hasAnyRole("DUENO", "SECRETARIA", "MANUFACTURA")

                        .requestMatchers(HttpMethod.POST, "/api/insumo")
                        .hasAnyRole("DUENO", "MANUFACTURA")

                        .requestMatchers(HttpMethod.PUT, "/api/insumo/*")
                        .hasAnyRole("DUENO", "MANUFACTURA")

                        .requestMatchers(HttpMethod.DELETE, "/api/insumo/*")
                        .hasRole("DUENO")

                        .requestMatchers(HttpMethod.GET, "/api/material", "/api/material/*")
                        .hasAnyRole("DUENO", "SECRETARIA", "MANUFACTURA")

                        .requestMatchers(HttpMethod.POST, "/api/material")
                        .hasAnyRole("DUENO", "MANUFACTURA")

                        .requestMatchers(HttpMethod.PUT, "/api/material/*")
                        .hasAnyRole("DUENO", "MANUFACTURA")

                        .requestMatchers(HttpMethod.DELETE, "/api/material/*")
                        .hasRole("DUENO")

                        // Calendarización
                        .requestMatchers(HttpMethod.GET, "/api/actividad", "/api/actividad/*")
                        .hasAnyRole("DUENO", "SECRETARIA", "DISENADOR", "MANUFACTURA")

                        .requestMatchers(HttpMethod.POST, "/api/actividad")
                        .hasRole("DUENO")

                        .requestMatchers(HttpMethod.PUT, "/api/actividad/*")
                        .hasRole("DUENO")

                        .requestMatchers(HttpMethod.DELETE, "/api/actividad/*")
                        .hasRole("DUENO")

                        .requestMatchers(HttpMethod.GET, "/api/tipo-producto")
                        .hasAnyRole("DUENO", "SECRETARIA")

                        // Inventario: entradas y salidas de stock
                        .requestMatchers(HttpMethod.POST, "/api/insumo/*/movimientos")
                        .hasAnyRole("DUENO", "MANUFACTURA")
                        // Taller: reportar avance y terminar trabajos
                        .requestMatchers(HttpMethod.POST, "/api/actividad/*/avance", "/api/actividad/*/terminar")
                        .hasAnyRole("DUENO", "MANUFACTURA")
                        // Mantenimiento de maquinaria
                        .requestMatchers(HttpMethod.GET, "/api/maquinas", "/api/maquinas/**")
                        .hasAnyRole("DUENO", "MANUFACTURA")
                        .requestMatchers("/api/maquinas", "/api/maquinas/**")
                        .hasRole("DUENO")
                        // Cualquier otra ruta requiere login
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}