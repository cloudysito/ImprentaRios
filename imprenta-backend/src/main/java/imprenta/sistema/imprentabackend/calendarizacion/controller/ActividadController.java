package imprenta.sistema.imprentabackend.calendarizacion.controller;

import imprenta.sistema.imprentabackend.auth.UsuarioActual;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadRequestDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.ActividadResponeDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.AsignacionDTO;
import imprenta.sistema.imprentabackend.calendarizacion.dtos.ReporteAvanceDTO;
import imprenta.sistema.imprentabackend.calendarizacion.service.IActividadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    // El dueño puede consultar las de otro empleado con ?empleadoId=
    @GetMapping("/mis-asignaciones")
    public ResponseEntity<List<AsignacionDTO>> misAsignaciones(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam(required = false) String empleadoId) {
        String id = esDueno() && empleadoId != null && !empleadoId.isBlank()
                ? empleadoId
                : UsuarioActual.empleadoId();
        return ResponseEntity.ok(actividadService.misAsignaciones(id, fecha));
    }

    @GetMapping({ "/{id}"})
    public ResponseEntity<ActividadResponeDTO> buscarActividad(@PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(actividadService.buscarActividad(id));
    }

    @PostMapping("/{id}/avance")
    public ResponseEntity<AsignacionDTO> reportarAvance(@PathVariable String id, @Valid @RequestBody ReporteAvanceDTO dto) {
        return ResponseEntity.ok(actividadService.reportarAvance(id, dto, UsuarioActual.empleadoId(), esDueno()));
    }

    @PostMapping("/{id}/terminar")
    public ResponseEntity<AsignacionDTO> terminar(@PathVariable String id) {
        return ResponseEntity.ok(actividadService.terminarActividad(id, UsuarioActual.empleadoId(), esDueno()));
    }

    @DeleteMapping({ "/{id}"})
    public void eliminarActividad(@PathVariable String id) {
        actividadService.eliminarActividad(id);
    }

    @GetMapping
    public ResponseEntity<List<ActividadResponeDTO>> listar(@RequestParam(required = false) String pedidoId) {
        return ResponseEntity.ok(actividadService.listarActividades(pedidoId));
    }

    private boolean esDueno() {
        return UsuarioActual.tieneRol("DUENO");
    }
}
