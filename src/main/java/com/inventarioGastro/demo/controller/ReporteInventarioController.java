package com.inventarioGastro.demo.controller;

import com.inventarioGastro.demo.dto.ReporteInventarioDTO;
import com.inventarioGastro.demo.service.ReporteInventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteInventarioController {
    
    @Autowired
    private ReporteInventarioService reporteService;
    
    @GetMapping("/inventario")
    public ResponseEntity<ReporteInventarioDTO> generarReporte() {
        ReporteInventarioDTO reporte = reporteService.generarReporte();
        return ResponseEntity.ok(reporte);
    }
}

