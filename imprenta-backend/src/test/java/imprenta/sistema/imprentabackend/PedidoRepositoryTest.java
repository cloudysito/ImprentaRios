package imprenta.sistema.imprentabackend.pedidos.repository;

import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class PedidoRepositoryTest {

    @Test
    void defineBusquedaPorFolioParaMongo() throws NoSuchMethodException {
        Method method = PedidoRepository.class.getMethod("findByFolio", String.class);

        assertEquals(Optional.class, method.getReturnType());
    }
}