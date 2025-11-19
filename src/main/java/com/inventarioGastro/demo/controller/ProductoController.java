package com.inventarioGastro.demo.controller;

import com.inventarioGastro.demo.dto.ProductoDTO;
import com.inventarioGastro.demo.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    
    @GetMapping
    public ResponseEntity<List<ProductoDTO>> obtenerTodos() {
        List<ProductoDTO> productos = productoService.obtenerTodos();
        return ResponseEntity.ok(productos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable Long id) {
        ProductoDTO producto = productoService.obtenerPorId(id);
        return ResponseEntity.ok(producto);
    }
    
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<ProductoDTO>> obtenerPorCategoria(@PathVariable Long categoriaId) {
        List<ProductoDTO> productos = productoService.obtenerPorCategoria(categoriaId);
        return ResponseEntity.ok(productos);
    }
    
    @GetMapping("/bajo-stock")
    public ResponseEntity<List<ProductoDTO>> obtenerBajoStock() {
        List<ProductoDTO> productos = productoService.obtenerProductosBajoStock();
        return ResponseEntity.ok(productos);
    }
    
    @GetMapping("/proximos-vencer")
    public ResponseEntity<List<ProductoDTO>> obtenerProximosAVencer(
            @RequestParam(defaultValue = "7") int dias) {
        List<ProductoDTO> productos = productoService.obtenerProductosProximosAVencer(dias);
        return ResponseEntity.ok(productos);
    }
    
    @GetMapping("/alertas")
    public ResponseEntity<List<ProductoDTO>> obtenerProductosConAlertas(
            @RequestParam(defaultValue = "7") int dias) {
        List<ProductoDTO> productos = productoService.obtenerProductosConAlertas(dias);
        return ResponseEntity.ok(productos);
    }
    
    @GetMapping("/buscar")
    public ResponseEntity<List<ProductoDTO>> buscar(
            @RequestParam String busqueda) {
        List<ProductoDTO> productos = productoService.buscarPorNombreODescripcion(busqueda);
        return ResponseEntity.ok(productos);
    }
    
    @PostMapping
    public ResponseEntity<ProductoDTO> crear(@Valid @RequestBody ProductoDTO productoDTO) {
        ProductoDTO productoCreado = productoService.crear(productoDTO);
        return new ResponseEntity<>(productoCreado, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProductoDTO productoDTO) {
        ProductoDTO productoActualizado = productoService.actualizar(id, productoDTO);
        return ResponseEntity.ok(productoActualizado);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

