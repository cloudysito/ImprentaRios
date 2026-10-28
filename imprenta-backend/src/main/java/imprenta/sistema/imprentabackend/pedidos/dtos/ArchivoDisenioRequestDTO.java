package imprenta.sistema.imprentabackend.pedidos.dtos;

import jakarta.validation.constraints.NotBlank;

public record ArchivoDisenioRequestDTO(
        @NotBlank(message = "El archivo de diseño es obligatorio.")
        String rutaArchivo
) {
}
