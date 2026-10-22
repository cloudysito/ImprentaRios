package imprenta.sistema.imprentabackend.pedidos.service.impl;

import imprenta.sistema.imprentabackend.pedidos.model.Cliente;
import imprenta.sistema.imprentabackend.pedidos.repository.ClienteRepository;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {
    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Cliente crearCliente(Cliente cliente){

        //Validaciones
        if (cliente.getNombre() == null || "".equals(cliente.getNombre())) {
            throw new IllegalArgumentException("ERROR: El nombre es obligatorio");
        }

        if(cliente.getCorreo() == null || "".equals(cliente.getCorreo())) {
            throw new IllegalArgumentException("ERROR: El correo es obligatorio");
        }

        // Cliente clienteExistente = clienteRepository.findByCorreo(cliente.getCorreo()); //<<podemos usar esto cuando llenemos los repositories

        return cliente;
    }
}
