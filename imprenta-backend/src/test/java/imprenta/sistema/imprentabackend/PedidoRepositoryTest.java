package imprenta.sistema.imprentabackend.pedidos.repository;

import imprenta.sistema.imprentabackend.pedidos.model.Pedido;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class PedidoRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Test
    void testGuardarYBuscarPorFolio() {
        Pedido pedido = new Pedido();
        pedido.setFolio("FOL-12345");
        // FALLA AQUÍ: No se asignó un Cliente (not-null constraint) ni se persistió previamente la relación en H2
        entityManager.persist(pedido);
        entityManager.flush();

        Optional<Pedido> encontrado = pedidoRepository.findByFolio("FOL-12345");

        assertTrue(encontrado.isPresent());
    }
}