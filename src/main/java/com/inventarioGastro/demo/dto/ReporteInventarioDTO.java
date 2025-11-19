package com.inventarioGastro.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteInventarioDTO {
    
    private int totalProductos;
    private int productosBajoStock;
    private int productosProximosAVencer;
    private BigDecimal valorTotalInventario;
    private List<ProductoDTO> productosConAlertas;
}

