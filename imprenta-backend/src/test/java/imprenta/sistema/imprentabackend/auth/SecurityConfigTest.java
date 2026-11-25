package imprenta.sistema.imprentabackend.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = SecurityConfigTest.SecurityProbeController.class)
@Import({SecurityConfig.class, SecurityConfigTest.JwtFilterTestConfiguration.class})
class SecurityConfigTest {

    private final MockMvc mockMvc;

    @Autowired
    SecurityConfigTest(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    @BeforeEach
    void limpiarContextoDeSeguridad() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void loginEsPublico() throws Exception {
        mockMvc.perform(get("/api/empleados/login"))
                .andExpect(status().isNotFound());
    }

    @Test
    void rutaProtegidaRequiereAutenticacion() throws Exception {
        mockMvc.perform(get("/api/pedidos/1"))
                .andExpect(status().isUnauthorized());
    }

    @ParameterizedTest(name = "{0} {1} permite {2} y rechaza los demas roles")
    @MethodSource("politicasDeAcceso")
    void aplicaPermisosPorRol(HttpMethod method, String path, String rolesPermitidos) throws Exception {
        for (String role : rolesPermitidos.split(",")) {
            assertThat(ejecutar(method, path, user("empleado").roles(role)).getResponse().getStatus())
                    .as("El rol %s debe tener acceso a %s %s", role, method, path)
                    .isNotEqualTo(403);
        }

        for (String role : new String[]{"DUENO", "SECRETARIA", "DISENADOR", "MANUFACTURA"}) {
            if (!rolesPermitidos.contains(role)) {
                mockMvc.perform(request(method, path).with(user("empleado").roles(role)))
                        .andExpect(status().isForbidden());
            }
        }
    }

    private org.springframework.test.web.servlet.MvcResult ejecutar(
            HttpMethod method,
            String path,
            RequestPostProcessor usuario
    ) throws Exception {
        return mockMvc.perform(request(method, path).with(usuario)).andReturn();
    }

    private MockHttpServletRequestBuilder request(HttpMethod method, String path) {
        return MockMvcRequestBuilders.request(method, path);
    }

    private static Stream<Object[]> politicasDeAcceso() {
        return Stream.of(
                new Object[]{HttpMethod.GET, "/api/empleados/1", "DUENO"},
                new Object[]{HttpMethod.PATCH, "/api/pedidos/1/estado", "DUENO,MANUFACTURA"},
                new Object[]{HttpMethod.GET, "/api/pedidos/1", "DUENO,SECRETARIA,DISENADOR,MANUFACTURA"},
                new Object[]{HttpMethod.POST, "/api/pedidos", "DUENO,SECRETARIA"},
                new Object[]{HttpMethod.PUT, "/api/pedidos/1", "DUENO,SECRETARIA"},
                new Object[]{HttpMethod.DELETE, "/api/pedidos/1", "DUENO"},
                new Object[]{HttpMethod.GET, "/api/cliente/1", "DUENO,SECRETARIA"},
                new Object[]{HttpMethod.POST, "/api/cliente", "DUENO,SECRETARIA"},
                new Object[]{HttpMethod.PUT, "/api/cliente/1", "DUENO,SECRETARIA"},
                new Object[]{HttpMethod.DELETE, "/api/cliente/1", "DUENO"},
                new Object[]{HttpMethod.GET, "/api/archivo_disenio/1", "DUENO,SECRETARIA,DISENADOR,MANUFACTURA"},
                new Object[]{HttpMethod.POST, "/api/archivo_disenio", "DUENO,DISENADOR"},
                new Object[]{HttpMethod.PUT, "/api/archivo_disenio/1", "DUENO,DISENADOR"},
                new Object[]{HttpMethod.DELETE, "/api/archivo_disenio/1", "DUENO,DISENADOR"},
                new Object[]{HttpMethod.GET, "/api/insumo/1", "DUENO,SECRETARIA,MANUFACTURA"},
                new Object[]{HttpMethod.POST, "/api/insumo", "DUENO,MANUFACTURA"},
                new Object[]{HttpMethod.PUT, "/api/insumo/1", "DUENO,MANUFACTURA"},
                new Object[]{HttpMethod.DELETE, "/api/insumo/1", "DUENO"},
                new Object[]{HttpMethod.GET, "/api/actividad/1", "DUENO,SECRETARIA,DISENADOR,MANUFACTURA"},
                new Object[]{HttpMethod.POST, "/api/actividad", "DUENO"},
                new Object[]{HttpMethod.PUT, "/api/actividad/1", "DUENO"},
                new Object[]{HttpMethod.DELETE, "/api/actividad/1", "DUENO"},
                new Object[]{HttpMethod.GET, "/api/tipo-producto", "DUENO,SECRETARIA,DISENADOR,MANUFACTURA"},
                new Object[]{HttpMethod.DELETE, "/api/tipo-producto/1", "DUENO"},
                new Object[]{HttpMethod.POST, "/api/insumo/1/movimientos", "DUENO,MANUFACTURA"},
                new Object[]{HttpMethod.POST, "/api/actividad/1/avance", "DUENO,MANUFACTURA"},
                new Object[]{HttpMethod.GET, "/api/maquinas", "DUENO,SECRETARIA,DISENADOR,MANUFACTURA"},
                new Object[]{HttpMethod.GET, "/api/maquinas/1", "DUENO,MANUFACTURA"},
                new Object[]{HttpMethod.PUT, "/api/maquinas/1", "DUENO"}
        );
    }

    @RestController
    static class SecurityProbeController {
    }

    @TestConfiguration
    static class JwtFilterTestConfiguration {
        @Bean
        JwtAuthenticationFilter jwtAuthenticationFilter() {
            return new JwtAuthenticationFilter(null, null) {
                @Override
                protected void doFilterInternal(
                        jakarta.servlet.http.HttpServletRequest request,
                        jakarta.servlet.http.HttpServletResponse response,
                        jakarta.servlet.FilterChain filterChain
                ) throws java.io.IOException, jakarta.servlet.ServletException {
                    filterChain.doFilter(request, response);
                }
            };
        }
    }
}
