package imprenta.sistema.imprentabackend.exceptions;

import lombok.Getter;

@Getter
public class NegocioException extends RuntimeException{
    private final CodigoError codigo;

    public NegocioException(CodigoError codigo) {
        super(codigo.getMensaje());
        this.codigo = codigo;
    }
}
