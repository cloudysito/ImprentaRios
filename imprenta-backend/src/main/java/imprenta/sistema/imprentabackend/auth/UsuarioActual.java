package imprenta.sistema.imprentabackend.auth;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

// Lee el empleado del token. JwtAuthenticationFilter guarda su id en los details
public final class UsuarioActual {
    private UsuarioActual() {}

    public static String empleadoId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return null;
        }
        return auth.getDetails() instanceof String id && !id.isBlank() ? id : null;
    }

    public static boolean tieneRol(String rol) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> ("ROLE_" + rol).equals(a.getAuthority()));
    }
}
