package imprenta.sistema.imprentabackend.pedidos.service.impl;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.pedidos.dtos.ClienteRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ClienteResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.mappers.ClienteMapper;
import imprenta.sistema.imprentabackend.pedidos.model.Cliente;
import imprenta.sistema.imprentabackend.pedidos.repository.ClienteRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.IClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ClienteService implements IClienteService {
    private final ClienteRepository clienteRepository;
    private final PedidoRepository pedidoRepository;

    @Override
    public ClienteResponseDTO crearCliente(ClienteRequestDTO dto) {
        Cliente guardado = clienteRepository.save(ClienteMapper.toEntity(dto));
        return ClienteMapper.toResponse(guardado);
    }

    @Override
    public void eliminarCliente(String id) {
        Cliente cliente = obtenerCliente(id);
        if (pedidoRepository.existsByClienteId(cliente.getId())) {
            throw new NegocioException(CodigoError.CLIENTE_EN_USO);
        }
        clienteRepository.delete(cliente);
    }

    @Override
    public ClienteResponseDTO actualizarCliente(String id, ClienteRequestDTO dto) {
        Cliente cliente = obtenerCliente(id);
        ClienteMapper.actualizarEntidad(cliente, dto);
        return ClienteMapper.toResponse(clienteRepository.save(cliente));
    }

    @Override
    public ClienteResponseDTO buscarCliente(String id) {
        return ClienteMapper.toResponse(obtenerCliente(id));
    }

    @Override
    public List<ClienteResponseDTO> listarClientes(String busqueda) {
        Stream<Cliente> clientes = clienteRepository.findAll().stream();
        if (busqueda != null && !busqueda.isBlank()) {
            String termino = busqueda.trim().toLowerCase(Locale.ROOT);
            clientes = clientes.filter(cliente ->
                    contiene(cliente.getNombre(), termino)
                            || contiene(cliente.getTelefono(), termino)
                            || contiene(cliente.getCorreo(), termino));
        }
        return clientes
                .sorted(Comparator.comparing(
                        Cliente::getNombre,
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)))
                .map(ClienteMapper::toResponse)
                .toList();
    }

    private boolean contiene(String valor, String termino) {
        return valor != null && valor.toLowerCase(Locale.ROOT).contains(termino);
    }

    private Cliente obtenerCliente(String id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new NegocioException(CodigoError.CLIENTE_NO_ENCONTRADO));
    }
}
