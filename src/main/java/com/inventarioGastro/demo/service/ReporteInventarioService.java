package com.inventarioGastro.demo.service;

import com.inventarioGastro.demo.dto.ProductoDTO;
import com.inventarioGastro.demo.dto.ReporteInventarioDTO;
import com.inventarioGastro.demo.entity.Producto;
import com.inventarioGastro.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReporteInventarioService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private ProductoService productoService;
    
    public ReporteInventarioDTO generarReporte() {
        List<Producto> todosProductos = productoRepository.findAll();
        List<Producto> productosBajoStock = productoRepository.findProductosBajoStock();
        List<ProductoDTO> productosConAlertas = productoService.obtenerProductosConAlertas(7);
        
        // Calcular valor total del inventario
        BigDecimal valorTotal = todosProductos.stream()
                .filter(p -> p.getPrecioUnitario() != null && p.getCantidad() != null)
                .map(p -> p.getPrecioUnitario().multiply(p.getCantidad()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        ReporteInventarioDTO reporte = new ReporteInventarioDTO();
        reporte.setTotalProductos(todosProductos.size());
        reporte.setProductosBajoStock(productosBajoStock.size());
        reporte.setProductosProximosAVencer(
            (int) productosConAlertas.stream()
                .filter(ProductoDTO::isProximoAVencer)
                .count()
        );
        reporte.setValorTotalInventario(valorTotal);
        reporte.setProductosConAlertas(productosConAlertas);
        
        return reporte;
    }
}

