package imprenta.sistema.imprentabackend.exceptions;

import lombok.Getter;

@Getter
public class NegocioException extends RuntimeException{
    private final CodigoError codigo;

    public NegocioException(CodigoError codigo) {
        super(codigo.getMensaje());
        this.codigo = codigo;
    }

    // Para cuando el mensaje fijo del código no basta, ej. decir qué material falta
    public NegocioException(CodigoError codigo, String detalle) {
        super(detalle);
        this.codigo = codigo;
    }
}
