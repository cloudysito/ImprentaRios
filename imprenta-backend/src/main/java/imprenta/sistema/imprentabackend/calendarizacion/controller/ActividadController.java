package imprenta.sistema.imprentabackend.calendarizacion.controller;

import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadRequestDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadResponeDTO;
import imprenta.sistema.imprentabackend.calendarizacion.service.IActividadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actividad")
@RequiredArgsConstructor
public class ActividadController {
    private final IActividadService actividadService;

    @PostMapping
    public ResponseEntity<ActividadResponeDTO> agregar(@Valid @RequestBody ActividadRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(actividadService.agregarActividad(dto));
    }

    @PutMapping({ "/{id}"})
    public ResponseEntity<ActividadResponeDTO> actualizar(@Valid @RequestBody ActividadRequestDTO dto, @PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(actividadService.actualizarActividad(id,dto));
    }
    @GetMapping({ "/{id}"})
    public ResponseEntity<ActividadResponeDTO> buscarActividad(@PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(actividadService.buscarActividad(id));
    }

    @DeleteMapping({ "/{id}"})
    public void eliminarActividad(@PathVariable String id) {
        actividadService.eliminarActividad(id);
    }

    @GetMapping
    public ResponseEntity<List<ActividadResponeDTO>> listar(@RequestParam(required = false) String pedidoId) {
        return ResponseEntity.ok(actividadService.listarActividades(pedidoId));
    }
}
