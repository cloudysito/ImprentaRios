package imprenta.sistema.imprentabackend.auth;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {
    private static final int MAX_INTENTOS = 5;
    private static final Duration BLOQUEO = Duration.ofMinutes(3);

    private record Intento(int fallos, Instant bloqueadoHasta) {}

    private final Map<String, Intento> intentos = new ConcurrentHashMap<>();

    public void verificarNoBloqueado(String clave) {
        Intento i = intentos.get(clave);
        if (i != null && i.bloqueadoHasta() != null && Instant.now().isBefore(i.bloqueadoHasta())) {
            throw new NegocioException(CodigoError.DEMASIADOS_INTENTOS);
        }
    }

    public void registrarFallo(String clave) {
        intentos.compute(clave, (k, actual) -> {
            boolean reiniciar = actual == null
                    || (actual.bloqueadoHasta() != null && Instant.now().isAfter(actual.bloqueadoHasta()));
            int fallos = reiniciar ? 1 : actual.fallos() + 1;
            Instant hasta = fallos >= MAX_INTENTOS ? Instant.now().plus(BLOQUEO) : null;
            return new Intento(fallos, hasta);
        });
    }

    public void registrarExito(String clave) {
        intentos.remove(clave);
    }
}