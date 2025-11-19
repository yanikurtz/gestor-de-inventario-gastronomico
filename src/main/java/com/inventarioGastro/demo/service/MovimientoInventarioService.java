package com.inventarioGastro.demo.service;

import com.inventarioGastro.demo.dto.MovimientoInventarioDTO;
import com.inventarioGastro.demo.entity.MovimientoInventario;
import com.inventarioGastro.demo.entity.Producto;
import com.inventarioGastro.demo.exception.BusinessException;
import com.inventarioGastro.demo.exception.ResourceNotFoundException;
import com.inventarioGastro.demo.repository.MovimientoInventarioRepository;
import com.inventarioGastro.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MovimientoInventarioService {
    
    @Autowired
    private MovimientoInventarioRepository movimientoRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    public MovimientoInventarioDTO crear(MovimientoInventarioDTO movimientoDTO) {
        Producto producto = productoRepository.findById(movimientoDTO.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto", movimientoDTO.getProductoId()));
        
        BigDecimal cantidadAnterior = producto.getCantidad();
        BigDecimal cantidadNueva;
        
        // Calcular nueva cantidad según el tipo de movimiento
        if (movimientoDTO.getTipoMovimiento() == MovimientoInventario.TipoMovimiento.ENTRADA) {
            cantidadNueva = cantidadAnterior.add(movimientoDTO.getCantidad());
        } else { // SALIDA
            cantidadNueva = cantidadAnterior.subtract(movimientoDTO.getCantidad());
            
            // Validar que no haya stock negativo
            if (cantidadNueva.compareTo(BigDecimal.ZERO) < 0) {
                throw new BusinessException(
                    String.format("No hay suficiente stock. Disponible: %s %s, Solicitado: %s %s",
                        cantidadAnterior, producto.getUnidadMedida(),
                        movimientoDTO.getCantidad(), producto.getUnidadMedida())
                );
            }
        }
        
        // Actualizar cantidad del producto
        producto.setCantidad(cantidadNueva);
        productoRepository.save(producto);
        
        // Crear movimiento
        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setTipoMovimiento(movimientoDTO.getTipoMovimiento());
        movimiento.setCantidad(movimientoDTO.getCantidad());
        movimiento.setCantidadAnterior(cantidadAnterior);
        movimiento.setCantidadNueva(cantidadNueva);
        movimiento.setMotivo(movimientoDTO.getMotivo());
        movimiento.setResponsable(movimientoDTO.getResponsable());
        movimiento.setProducto(producto);
        
        MovimientoInventario movimientoGuardado = movimientoRepository.save(movimiento);
        return convertirADTO(movimientoGuardado);
    }
    
    public List<MovimientoInventarioDTO> obtenerTodos() {
        return movimientoRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    public MovimientoInventarioDTO obtenerPorId(Long id) {
        MovimientoInventario movimiento = movimientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento de inventario", id));
        return convertirADTO(movimiento);
    }
    
    public List<MovimientoInventarioDTO> obtenerPorProducto(Long productoId) {
        if (!productoRepository.existsById(productoId)) {
            throw new ResourceNotFoundException("Producto", productoId);
        }
        
        return movimientoRepository.findByProductoIdOrderByFechaMovimientoDesc(productoId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    public List<MovimientoInventarioDTO> obtenerPorRangoFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return movimientoRepository.findByFechaMovimientoBetween(fechaInicio, fechaFin).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    public List<MovimientoInventarioDTO> obtenerPorProductoYRangoFechas(
            Long productoId, LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        if (!productoRepository.existsById(productoId)) {
            throw new ResourceNotFoundException("Producto", productoId);
        }
        
        return movimientoRepository.findByProductoAndFechaBetween(productoId, fechaInicio, fechaFin).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    private MovimientoInventarioDTO convertirADTO(MovimientoInventario movimiento) {
        MovimientoInventarioDTO dto = new MovimientoInventarioDTO();
        dto.setId(movimiento.getId());
        dto.setTipoMovimiento(movimiento.getTipoMovimiento());
        dto.setCantidad(movimiento.getCantidad());
        dto.setCantidadAnterior(movimiento.getCantidadAnterior());
        dto.setCantidadNueva(movimiento.getCantidadNueva());
        dto.setMotivo(movimiento.getMotivo());
        dto.setResponsable(movimiento.getResponsable());
        dto.setProductoId(movimiento.getProducto().getId());
        dto.setProductoNombre(movimiento.getProducto().getNombre());
        dto.setFechaMovimiento(movimiento.getFechaMovimiento());
        return dto;
    }
}

