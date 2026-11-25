package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;
import imprenta.sistema.imprentabackend.calendarizacion.repository.ActividadRepository;
import imprenta.sistema.imprentabackend.calendarizacion.service.impl.ActividadService;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoDetalleDTO;
import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;
import imprenta.sistema.imprentabackend.pedidos.service.IPedidoService;
import imprenta.sistema.imprentabackend.usuarios.repository.EmpleadoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ActividadServiceTest {

    @Mock
    private ActividadRepository actividadRepository;

    @Mock
    private IPedidoService pedidoService;

    @Mock
    private EmpleadoRepository empleadoRepository;

    @InjectMocks
    private ActividadService actividadService;

    @Test
    void generarCronograma_GuardaActividadesYActualizaEstadoDelPedido() {
        String pedidoId = "pedido-1";
        String empleadoResponsableId = "empleado-produccion";
        String solicitanteId = "dueno-1";
        LocalDateTime entrega = LocalDateTime.now().plusDays(14);

        when(pedidoService.obtenerDetalle(pedidoId)).thenReturn(
                new PedidoDetalleDTO(
                        pedidoId,
                        "PED-2026-0001",
                        "Cliente",
                        "Volantes",
                        100,
                        entrega,
                        EstadoPedido.REGISTRADO,
                        false,
                        0,
                        false,
                        0,
                        null,
                        null,
                        List.of()
                )
        );
        when(empleadoRepository.existsById(empleadoResponsableId)).thenReturn(true);
        when(actividadRepository.saveAll(anyList())).thenAnswer(invocacion -> {
            List<Actividad> actividades = invocacion.getArgument(0);
            List<Actividad> guardadas = new ArrayList<>();
            for (Actividad actividad : actividades) {
                actividad.setId("actividad-" + guardadas.size());
                guardadas.add(actividad);
            }
            return guardadas;
        });

        var creadas = actividadService.generarCronograma(
                pedidoId,
                empleadoResponsableId,
                solicitanteId
        );

        assertEquals(4, creadas.size());
        assertEquals(empleadoResponsableId, creadas.get(0).empleadoId());
        verify(pedidoService).alGenerarCronograma(pedidoId, solicitanteId);
    }
}
