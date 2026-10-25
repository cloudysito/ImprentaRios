package imprenta.sistema.imprentabackend.exceptions;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(NegocioException.class)
    public ProblemDetail negocio(NegocioException e){
        CodigoError codigo = e.getCodigo();
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(codigo.getStatus(), codigo.getMensaje());
        problemDetail.setTitle("Error de negocio");
        problemDetail.setProperty("codigo", codigo.name());
        return problemDetail;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail inesperado(Exception e) {
        log.error("Error no controlado", e);
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor");
    }
}
