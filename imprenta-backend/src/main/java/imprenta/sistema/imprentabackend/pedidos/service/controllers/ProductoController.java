package imprenta.sistema.imprentabackend.pedidos.service.controllers;

import imprenta.sistema.imprentabackend.pedidos.dtos.ProductoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ProductoResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.service.IProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/producto")
@RequiredArgsConstructor
public class ProductoController {
    private final IProductoService productoService;

    @PostMapping
    public ResponseEntity<ProductoResponseDTO> registrar(@Valid @RequestBody ProductoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.registrarProducto(dto));
    }

    @PutMapping({ "/{id}"})
    public ResponseEntity<ProductoResponseDTO> actualizar(@Valid @RequestBody ProductoRequestDTO dto, @PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(productoService.actualizarProducto(id, dto));
    }

    @GetMapping({ "/{id}"})
    public ResponseEntity<ProductoResponseDTO> buscarProducto(@PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(productoService.buscarProducto(id));
    }

    @DeleteMapping({ "/{id}"})
    public void eliminarProducto(@PathVariable String id) {
        productoService.eliminarProducto(id);
    }
}
