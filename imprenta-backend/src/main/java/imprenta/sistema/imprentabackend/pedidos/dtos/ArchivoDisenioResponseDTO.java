package imprenta.sistema.imprentabackend.pedidos.dtos;

import java.time.LocalDate;

public record ArchivoDisenioResponseDTO(
        String id,
        String nombreArchivo,
        LocalDate fechaRecepcion,
        LocalDate fechaEntrega,
        Integer resolucion,
        String modoColor,
        Integer sangrado,
        String medidaArchivo,
        Integer caras,
        String prensa,
        Integer version
) {
}
