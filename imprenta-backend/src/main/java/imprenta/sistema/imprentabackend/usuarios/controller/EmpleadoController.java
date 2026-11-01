package imprenta.sistema.imprentabackend.usuarios.controller;

import imprenta.sistema.imprentabackend.auth.JwtService;
import imprenta.sistema.imprentabackend.auth.dto.LoginRequest;
import imprenta.sistema.imprentabackend.auth.dto.LoginResponse;
import imprenta.sistema.imprentabackend.usuarios.dtos.EmpleadoRequestDTO;
import imprenta.sistema.imprentabackend.usuarios.dtos.EmpleadoResponseDTO;
import imprenta.sistema.imprentabackend.usuarios.service.IEmpleadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
public class EmpleadoController {
    private final IEmpleadoService empleadoService;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> autenticar(@RequestBody LoginRequest request) {
        EmpleadoResponseDTO empleado = empleadoService.autenticarEmpleado(
                request.usuario(),
                request.password()
        );

        String token = jwtService.generarToken(
                empleado.usuario(),
                empleado.rol().name(),
                empleado.nombre(),
                empleado.id()
        );

        return ResponseEntity.ok(new LoginResponse(token, empleado));
    }

    @PostMapping
    public ResponseEntity<EmpleadoResponseDTO> crear(@Valid @RequestBody EmpleadoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(empleadoService.agregarEmpleado(dto));
    }

    @GetMapping
    public ResponseEntity<List<EmpleadoResponseDTO>> listar() {
        return ResponseEntity.ok(empleadoService.listarEmpleados());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpleadoResponseDTO> obtener(@PathVariable String id) {
        return ResponseEntity.ok(empleadoService.obtenerEmpleado(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpleadoResponseDTO> actualizar(@PathVariable String id, @Valid @RequestBody EmpleadoRequestDTO dto) {
        return ResponseEntity.ok(empleadoService.actualizarEmpleado(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        empleadoService.eliminarEmpleado(id);
        return ResponseEntity.noContent().build();
    }
}
