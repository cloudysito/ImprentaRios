package imprenta.sistema.imprentabackend.auth;

import imprenta.sistema.imprentabackend.usuarios.model.Empleado;
import imprenta.sistema.imprentabackend.usuarios.repository.EmpleadoRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final EmpleadoRepository empleadoRepository;

    public JwtAuthenticationFilter(JwtService jwtService, EmpleadoRepository empleadoRepository) {
        this.jwtService = jwtService;
        this.empleadoRepository = empleadoRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");

        if (authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7).trim();

            if (!token.isEmpty() && jwtService.esTokenValido(token)) {
                String empleadoId = jwtService.extraerEmpleadoId(token);

                Empleado empleado = empleadoId == null
                        ? null
                        : empleadoRepository.findById(empleadoId).orElse(null);

                if (empleado != null
                        && Boolean.TRUE.equals(empleado.getActivo())
                        && empleado.getRol() != null) {
                    var authentication = new UsernamePasswordAuthenticationToken(
                            empleado.getUsuario(),
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + empleado.getRol().name()))
                    );
                    authentication.setDetails(empleado.getId());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}