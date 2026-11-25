package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.inventario.dtos.MaterialRequestDTO;
import imprenta.sistema.imprentabackend.inventario.model.Material;
import imprenta.sistema.imprentabackend.inventario.repository.InsumoRepository;
import imprenta.sistema.imprentabackend.inventario.repository.MaterialRepository;
import imprenta.sistema.imprentabackend.inventario.service.impl.MaterialService;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MaterialServiceTest {

    @Mock private MaterialRepository materialRepository;
    @Mock private InsumoRepository insumoRepository;
    @Mock private PedidoRepository pedidoRepository;

    @InjectMocks private MaterialService materialService;

    @Test
    void agregarMaterial_InsumoExistente_GuardaMaterial() {
        MaterialRequestDTO dto = new MaterialRequestDTO("Papel couché", 130, "insumo-1");
        when(insumoRepository.existsById("insumo-1")).thenReturn(true);
        when(materialRepository.save(any(Material.class))).thenAnswer(invocation -> {
            Material material = invocation.getArgument(0);
            material.setId("material-1");
            return material;
        });

        var respuesta = materialService.agregarMaterial(dto);

        assertEquals("material-1", respuesta.id());
        assertEquals("Papel couché", respuesta.nombre());
    }

    @Test
    void agregarMaterial_InsumoNoExiste_LanzaExcepcion() {
        MaterialRequestDTO dto = new MaterialRequestDTO("Papel couché", 130, "insumo-404");
        when(insumoRepository.existsById("insumo-404")).thenReturn(false);

        NegocioException ex = assertThrows(NegocioException.class,
                () -> materialService.agregarMaterial(dto));

        assertEquals(CodigoError.INSUMO_NO_ENCONTRADO, ex.getCodigo());
        verify(materialRepository, never()).save(any());
    }

    @Test
    void eliminarMaterialUsadoEnPedidos_LanzaExcepcion() {
        Material material = new Material("material-1", "Papel", 130, "insumo-1");
        when(materialRepository.findById("material-1")).thenReturn(Optional.of(material));
        when(pedidoRepository.existsByProductosMaterialId("material-1")).thenReturn(true);

        NegocioException ex = assertThrows(NegocioException.class,
                () -> materialService.eliminarMaterialPorId("material-1"));

        assertEquals(CodigoError.MATERIAL_EN_USO, ex.getCodigo());
        verify(materialRepository, never()).delete(any());
    }

    @Test
    void buscarMaterialNoExistente_LanzaExcepcion() {
        when(materialRepository.findById("404")).thenReturn(Optional.empty());

        NegocioException ex = assertThrows(NegocioException.class,
                () -> materialService.buscarMaterialPorId("404"));

        assertEquals(CodigoError.MATERIAL_NO_ENCONTRADO, ex.getCodigo());
    }
}
