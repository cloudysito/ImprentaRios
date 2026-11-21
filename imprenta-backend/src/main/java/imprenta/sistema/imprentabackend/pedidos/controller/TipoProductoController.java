package imprenta.sistema.imprentabackend.pedidos.controller;

import imprenta.sistema.imprentabackend.pedidos.model.TipoProducto;
import imprenta.sistema.imprentabackend.pedidos.service.ITipoProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/tipo-producto")
@RequiredArgsConstructor
public class TipoProductoController {
    private final ITipoProductoService tipoProductoService;

    @GetMapping
    public List<TipoProducto> listar() {
        return tipoProductoService.listar();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        tipoProductoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
