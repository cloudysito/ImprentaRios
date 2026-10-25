package imprenta.sistema.imprentabackend.exceptions;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CodigoError {
    ACTIVIDAD_NO_ENCONTRADA(HttpStatus.NOT_FOUND, "Actividad no encontrada"),
    EMPLEADO_OCUPADO(HttpStatus.CONFLICT, "El empleado ya tiene una actividad asignada en ese horario"),
    PEDIDO_NO_ENCONTRADO(HttpStatus.NOT_FOUND, "Pedido no encontrado");

    private final HttpStatus status;
    private final String mensaje;
}
