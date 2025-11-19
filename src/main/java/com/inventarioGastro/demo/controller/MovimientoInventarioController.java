package com.inventarioGastro.demo.controller;

import com.inventarioGastro.demo.dto.MovimientoInventarioDTO;
import com.inventarioGastro.demo.service.MovimientoInventarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/movimientos")
@CrossOrigin(origins = "*")
public class MovimientoInventarioController {
    
    @Autowired
    private MovimientoInventarioService movimientoService;
    
    @GetMapping
    public ResponseEntity<List<MovimientoInventarioDTO>> obtenerTodos() {
        List<MovimientoInventarioDTO> movimientos = movimientoService.obtenerTodos();
        return ResponseEntity.ok(movimientos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MovimientoInventarioDTO> obtenerPorId(@PathVariable Long id) {
        MovimientoInventarioDTO movimiento = movimientoService.obtenerPorId(id);
        return ResponseEntity.ok(movimiento);
    }
    
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<MovimientoInventarioDTO>> obtenerPorProducto(@PathVariable Long productoId) {
        List<MovimientoInventarioDTO> movimientos = movimientoService.obtenerPorProducto(productoId);
        return ResponseEntity.ok(movimientos);
    }
    
    @GetMapping("/rango-fechas")
    public ResponseEntity<List<MovimientoInventarioDTO>> obtenerPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        List<MovimientoInventarioDTO> movimientos = movimientoService.obtenerPorRangoFechas(fechaInicio, fechaFin);
        return ResponseEntity.ok(movimientos);
    }
    
    @GetMapping("/producto/{productoId}/rango-fechas")
    public ResponseEntity<List<MovimientoInventarioDTO>> obtenerPorProductoYRangoFechas(
            @PathVariable Long productoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        List<MovimientoInventarioDTO> movimientos = 
            movimientoService.obtenerPorProductoYRangoFechas(productoId, fechaInicio, fechaFin);
        return ResponseEntity.ok(movimientos);
    }
    
    @PostMapping
    public ResponseEntity<MovimientoInventarioDTO> crear(@Valid @RequestBody MovimientoInventarioDTO movimientoDTO) {
        MovimientoInventarioDTO movimientoCreado = movimientoService.crear(movimientoDTO);
        return new ResponseEntity<>(movimientoCreado, HttpStatus.CREATED);
    }
}

