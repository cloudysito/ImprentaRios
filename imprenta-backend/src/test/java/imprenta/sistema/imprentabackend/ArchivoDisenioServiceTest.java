package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.model.ArchivoDisenio;
import imprenta.sistema.imprentabackend.pedidos.repository.ArchivoDisenioRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.impl.ArchivoDisenioService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ArchivoDisenioServiceTest {

    @Mock private ArchivoDisenioRepository archivoDisenioRepository;
    @Mock private PedidoRepository pedidoRepository;

    @InjectMocks private ArchivoDisenioService archivoDisenioService;

    private ArchivoDisenioRequestDTO dto(Integer version, String grupoId) {
        return new ArchivoDisenioRequestDTO(
                "menu.pdf",
                LocalDate.of(2026, 11, 20),
                LocalDate.of(2026, 11, 25),
                300,
                "CMYK",
                3,
                "22.1 x 14.6 cm",
                2,
                "Offset",
                version,
                grupoId
        );
    }

    private ArchivoDisenio version(String id, int numero, String grupoId) {
        ArchivoDisenio archivo = new ArchivoDisenio();
        archivo.setId(id);
        archivo.setNombreArchivo("menu.pdf");
        archivo.setVersion(numero);
        archivo.setGrupoId(grupoId);
        return archivo;
    }

    @Test
    void registrarSinGrupo_CreaVersionUno() {
        when(archivoDisenioRepository.save(any(ArchivoDisenio.class)))
                .thenAnswer(invocation -> {
                    ArchivoDisenio archivo = invocation.getArgument(0);
                    archivo.setId("v1");
                    return archivo;
                });

        var respuesta = archivoDisenioService.registrarArchivoDisenio(dto(9, null));

        assertEquals(1, respuesta.version());
        assertNull(respuesta.grupoId());
    }

    @Test
    void registrarConGrupo_AsignaSiguienteVersion() {
        when(archivoDisenioRepository.findById("v1"))
                .thenReturn(Optional.of(version("v1", 1, null)));
        when(archivoDisenioRepository.findByGrupoId("v1"))
                .thenReturn(List.of(version("v2", 2, "v1")));
        when(archivoDisenioRepository.save(any(ArchivoDisenio.class)))
                .thenAnswer(invocation -> {
                    ArchivoDisenio archivo = invocation.getArgument(0);
                    archivo.setId("v3");
                    return archivo;
                });

        var respuesta = archivoDisenioService.registrarArchivoDisenio(dto(9, "v1"));

        assertEquals(3, respuesta.version());
        assertEquals("v1", respuesta.grupoId());
    }

    @Test
    void registrarConGrupoInexistente_LanzaExcepcion() {
        when(archivoDisenioRepository.findById("404")).thenReturn(Optional.empty());
        when(archivoDisenioRepository.findByGrupoId("404")).thenReturn(List.of());

        NegocioException ex = assertThrows(NegocioException.class,
                () -> archivoDisenioService.registrarArchivoDisenio(dto(1, "404")));

        assertEquals(CodigoError.ARCHIVO_DE_DISENIO_NO_ENCONTRADO, ex.getCodigo());
        verify(archivoDisenioRepository, never()).save(any());
    }

    @Test
    void actualizarVersion_ConservaVersionYGrupo() {
        ArchivoDisenio existente = version("v2", 2, "v1");
        when(archivoDisenioRepository.findById("v2")).thenReturn(Optional.of(existente));
        when(archivoDisenioRepository.save(any(ArchivoDisenio.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var respuesta = archivoDisenioService.actualizarArchivoDisenio("v2", dto(99, "otro"));

        assertEquals(2, respuesta.version());
        assertEquals("v1", respuesta.grupoId());
        assertEquals("menu.pdf", respuesta.nombreArchivo());
    }

    @Test
    void eliminarVersionUsadaEnPedido_LanzaExcepcion() {
        ArchivoDisenio existente = version("v2", 2, "v1");
        when(archivoDisenioRepository.findById("v2")).thenReturn(Optional.of(existente));
        when(pedidoRepository.existsByArchivoDisenioId("v2")).thenReturn(true);

        NegocioException ex = assertThrows(NegocioException.class,
                () -> archivoDisenioService.eliminarArchivoDisenio("v2"));

        assertEquals(CodigoError.ARCHIVO_DE_DISENIO_EN_USO, ex.getCodigo());
        verify(archivoDisenioRepository, never()).delete(any());
    }

    @Test
    void eliminarVersionUsadaEnListaDePedido_LanzaExcepcion() {
        ArchivoDisenio existente = version("v2", 2, "v1");
        when(archivoDisenioRepository.findById("v2")).thenReturn(Optional.of(existente));
        when(pedidoRepository.existsByArchivoDisenioId("v2")).thenReturn(false);
        when(pedidoRepository.existsByArchivosDisenioIdsContaining("v2")).thenReturn(true);

        NegocioException ex = assertThrows(NegocioException.class,
                () -> archivoDisenioService.eliminarArchivoDisenio("v2"));

        assertEquals(CodigoError.ARCHIVO_DE_DISENIO_EN_USO, ex.getCodigo());
        verify(archivoDisenioRepository, never()).delete(any());
    }
}
