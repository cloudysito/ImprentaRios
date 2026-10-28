package imprenta.sistema.imprentabackend.usuarios.controller;

import imprenta.sistema.imprentabackend.usuarios.model.Empleado;
import imprenta.sistema.imprentabackend.usuarios.service.IEmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
public class EmpleadoController {
    private final IEmpleadoService empleadoService;

    @PostMapping("/login")
    public ResponseEntity<Empleado> autenticar(@RequestParam String usuario, @RequestParam String password) throws Exception {
        Empleado empleado = empleadoService.autenticarEmpleado(usuario, password);
        return ResponseEntity.ok(empleado);
    }

    @PostMapping
    public ResponseEntity<Empleado> crear(@RequestBody Empleado empleado) throws Exception {
        return ResponseEntity.ok(empleadoService.agregarEmpleado(empleado));
    }

    @GetMapping
    public ResponseEntity<List<Empleado>> listar() throws Exception {
        return ResponseEntity.ok(empleadoService.listarEmpleados());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empleado> obtener(@PathVariable String id) throws Exception {
        return ResponseEntity.ok(empleadoService.obtenerEmpleado(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Empleado> actualizar(@PathVariable String id, @RequestBody Empleado empleado) throws Exception {
        return ResponseEntity.ok(empleadoService.actualizarEmpleado(empleado, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Empleado> eliminar(@PathVariable String id) throws Exception {
        empleadoService.eliminarEmpleado(id);
        return ResponseEntity.noContent().build();
    }
}
