package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.auth.LoginAttemptService;
import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class LoginAttemptServiceTest {

    private static final String CLAVE = "mruiz|127.0.0.1";

    private LoginAttemptService servicio;

    @BeforeEach
    void preparar() {
        servicio = new LoginAttemptService();
    }

    private void fallar(String clave, int veces) {
        for (int i = 0; i < veces; i++) {
            servicio.registrarFallo(clave);
        }
    }

    @Test
    void usuarioNuevoNoEstaBloqueado() {
        assertDoesNotThrow(() -> servicio.verificarNoBloqueado(CLAVE));
    }

    @Test
    void cuatroFallosSeguidosNoBloquean() {
        fallar(CLAVE, 4);

        assertDoesNotThrow(() -> servicio.verificarNoBloqueado(CLAVE));
    }

    @Test
    void elQuintoFalloBloquea() {
        fallar(CLAVE, 5);

        NegocioException ex = assertThrows(NegocioException.class,
                () -> servicio.verificarNoBloqueado(CLAVE));
        assertEquals(CodigoError.DEMASIADOS_INTENTOS, ex.getCodigo());
    }

    @Test
    void unInicioDeSesionExitosoReiniciaElContador() {
        fallar(CLAVE, 4);
        servicio.registrarExito(CLAVE);
        fallar(CLAVE, 4);

        assertDoesNotThrow(() -> servicio.verificarNoBloqueado(CLAVE));
    }

    @Test
    void elBloqueoDeUnUsuarioNoAfectaAOtro() {
        fallar(CLAVE, 5);

        assertDoesNotThrow(() -> servicio.verificarNoBloqueado("otro|127.0.0.1"));
    }
}