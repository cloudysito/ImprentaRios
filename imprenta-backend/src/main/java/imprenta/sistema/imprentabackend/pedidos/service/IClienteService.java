package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.pedidos.dtos.ClienteRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ClienteResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.model.Cliente;

public interface IClienteService {
    ClienteResponseDTO crearCliente(ClienteRequestDTO dto);
    void eliminarCliente(String id);
    ClienteResponseDTO actualizarCliente(String id, ClienteRequestDTO dto);
    ClienteResponseDTO buscarCliente(String id);
}
