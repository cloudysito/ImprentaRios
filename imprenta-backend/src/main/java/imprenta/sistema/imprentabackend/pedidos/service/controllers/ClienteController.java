package imprenta.sistema.imprentabackend.pedidos.service.controllers;

import imprenta.sistema.imprentabackend.pedidos.dtos.ClienteRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ClienteResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.service.IClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cliente")
@RequiredArgsConstructor
public class ClienteController {
    private final IClienteService clienteService;

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> crear(@Valid @RequestBody ClienteRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.crearCliente(dto));
    }

    @PutMapping({ "/{id}"})
    public ResponseEntity<ClienteResponseDTO> actualizar(@Valid @RequestBody ClienteRequestDTO dto, @PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(clienteService.actualizarCliente(id, dto));
    }

    @GetMapping({ "/{id}"})
    public ResponseEntity<ClienteResponseDTO> buscarCliente(@PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(clienteService.buscarCliente(id));
    }

    @DeleteMapping({ "/{id}"})
    public void eliminarCliente(@PathVariable String id) {
        clienteService.eliminarCliente(id);
    }

}
