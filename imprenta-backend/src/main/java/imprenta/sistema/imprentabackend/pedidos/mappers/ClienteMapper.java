package imprenta.sistema.imprentabackend.pedidos.mappers;

import imprenta.sistema.imprentabackend.pedidos.dtos.ClienteRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ClienteResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.model.Cliente;

public final class ClienteMapper {
    private ClienteMapper() {}

    public static Cliente toEntity(ClienteRequestDTO dto){
        Cliente cliente = new Cliente();
        actualizarEntidad(cliente, dto);
        return cliente;
    }

    public static void actualizarEntidad(Cliente cliente, ClienteRequestDTO dto){
        cliente.setNombre(dto.nombre());
        cliente.setCorreo(dto.correo());
        cliente.setTelefono(dto.telefono());
    }

    public static ClienteResponseDTO toResponse(Cliente cliente){
        return new ClienteResponseDTO(
                cliente.getId(),
                cliente.getNombre(),
                cliente.getTelefono(),
                cliente.getCorreo()
        );
    }
}
