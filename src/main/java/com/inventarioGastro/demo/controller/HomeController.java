package com.inventarioGastro.demo.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HomeController {
    
    /**
     * Endpoint raíz - muestra página HTML
     * La página HTML estática se sirve desde /static/index.html
     */
    
    /**
     * Endpoint para obtener información de la API en formato JSON
     */
    @GetMapping(value = "/api/info", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> apiInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("aplicacion", "Gestor de Inventario Gastronómico");
        response.put("version", "1.0.0");
        response.put("descripcion", "API REST para gestión de inventario gastronómico");
        response.put("baseUrl", "http://localhost:8080/api");
        response.put("formato", "JSON");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("categorias", "/api/categorias");
        endpoints.put("productos", "/api/productos");
        endpoints.put("movimientos", "/api/movimientos");
        endpoints.put("reportes", "/api/reportes/inventario");
        endpoints.put("h2-console", "/h2-console");
        response.put("endpoints", endpoints);
        
        return ResponseEntity.ok(response);
    }
}

