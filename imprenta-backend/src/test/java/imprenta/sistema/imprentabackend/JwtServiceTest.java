package imprenta.sistema.imprentabackend.auth;

import imprenta.sistema.imprentabackend.auth.JwtService;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void preparar() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey",
                "esta-es-una-clave-secreta-de-al-menos-32-bytes");
        ReflectionTestUtils.setField(jwtService, "jwtExpirationInMilliSec", 3600000L);
        jwtService.init();
    }

    @Test
    void generarTokenIncluyeUsuarioRolNombreEmpleadoYExpiracion() {
        String token = jwtService.generarToken(
                "ana", "DUENO", "Ana Ruiz", "empleado-1");

        Claims claims = jwtService.extraerClaims(token);

        assertEquals("ana", claims.getSubject());
        assertEquals("DUENO", jwtService.extraerRol(token));
        assertEquals("Ana Ruiz", claims.get("nombre", String.class));
        assertEquals("empleado-1", jwtService.extraerEmpleadoId(token));
        assertTrue(claims.getExpiration().after(claims.getIssuedAt()));
    }

    @Test
    void tokenValidoEsReconocidoYTokenAlteradoEsInvalido() {
        String token = jwtService.generarToken(
                "ana", "SECRETARIA", "Ana", "empleado-1");

        assertTrue(jwtService.esTokenValido(token));
        assertFalse(jwtService.esTokenValido(token + "alterado"));
    }

    @Test
    void llaveDeMenosDe32BytesLanzaExcepcion() {
        JwtService servicioInvalido = new JwtService();
        ReflectionTestUtils.setField(servicioInvalido, "secretKey", "corta");

        assertThrows(IllegalStateException.class, servicioInvalido::init);
    }
}
