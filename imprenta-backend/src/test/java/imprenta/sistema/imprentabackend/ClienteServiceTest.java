package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.pedidos.model.Cliente;
import imprenta.sistema.imprentabackend.pedidos.repository.ClienteRepository;
import imprenta.sistema.imprentabackend.pedidos.service.impl.ClienteService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteService clienteService;

    @Test
    void listarClientes_SinBusqueda_RegresaOrdenadosPorNombre() {
        when(clienteRepository.findAll()).thenReturn(List.of(
                new Cliente("2", "Zeta", "222", "zeta@example.com"),
                new Cliente("1", "Alfa", "111", "alfa@example.com")));

        var clientes = clienteService.listarClientes(null);

        assertEquals(List.of("Alfa", "Zeta"), clientes.stream().map(c -> c.nombre()).toList());
    }

    @Test
    void listarClientes_BuscaSinDistinguirMayusculasEnContacto() {
        when(clienteRepository.findAll()).thenReturn(List.of(
                new Cliente("1", "Papelería Norte", "6441234567", "compras@norte.mx"),
                new Cliente("2", "Impresos Centro", "6447654321", "ventas@centro.mx")));

        var clientes = clienteService.listarClientes("COMPRAS@");

        assertEquals(List.of("Papelería Norte"), clientes.stream().map(c -> c.nombre()).toList());
    }
}
