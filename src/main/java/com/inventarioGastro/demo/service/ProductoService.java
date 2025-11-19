package com.inventarioGastro.demo.service;

import com.inventarioGastro.demo.dto.ProductoDTO;
import com.inventarioGastro.demo.entity.Categoria;
import com.inventarioGastro.demo.entity.Producto;
import com.inventarioGastro.demo.exception.BusinessException;
import com.inventarioGastro.demo.exception.ResourceNotFoundException;
import com.inventarioGastro.demo.repository.CategoriaRepository;
import com.inventarioGastro.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    public List<ProductoDTO> obtenerTodos() {
        return productoRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    public ProductoDTO obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
        return convertirADTO(producto);
    }
    
    public ProductoDTO crear(ProductoDTO productoDTO) {
        if (productoRepository.existsByNombre(productoDTO.getNombre())) {
            throw new BusinessException("Ya existe un producto con el nombre: " + productoDTO.getNombre());
        }
        
        Categoria categoria = categoriaRepository.findById(productoDTO.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", productoDTO.getCategoriaId()));
        
        Producto producto = convertirAEntidad(productoDTO);
        producto.setCategoria(categoria);
        
        Producto productoGuardado = productoRepository.save(producto);
        return convertirADTO(productoGuardado);
    }
    
    public ProductoDTO actualizar(Long id, ProductoDTO productoDTO) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
        
        // Verificar si el nuevo nombre ya existe en otro producto
        if (!producto.getNombre().equals(productoDTO.getNombre()) && 
            productoRepository.existsByNombre(productoDTO.getNombre())) {
            throw new BusinessException("Ya existe un producto con el nombre: " + productoDTO.getNombre());
        }
        
        Categoria categoria = categoriaRepository.findById(productoDTO.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", productoDTO.getCategoriaId()));
        
        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setCantidad(productoDTO.getCantidad());
        producto.setUnidadMedida(productoDTO.getUnidadMedida());
        producto.setCantidadMinima(productoDTO.getCantidadMinima());
        producto.setFechaCaducidad(productoDTO.getFechaCaducidad());
        producto.setPrecioUnitario(productoDTO.getPrecioUnitario());
        producto.setProveedor(productoDTO.getProveedor());
        producto.setCategoria(categoria);
        
        Producto productoActualizado = productoRepository.save(producto);
        return convertirADTO(productoActualizado);
    }
    
    public void eliminar(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto", id);
        }
        productoRepository.deleteById(id);
    }
    
    public List<ProductoDTO> obtenerProductosBajoStock() {
        return productoRepository.findProductosBajoStock().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductoDTO> obtenerProductosProximosAVencer(int dias) {
        LocalDate fechaLimite = LocalDate.now().plusDays(dias);
        return productoRepository.findProductosProximosAVencer(fechaLimite).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductoDTO> obtenerProductosConAlertas(int dias) {
        LocalDate fechaLimite = LocalDate.now().plusDays(dias);
        return productoRepository.findProductosConAlertas(fechaLimite).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductoDTO> buscarPorNombreODescripcion(String busqueda) {
        return productoRepository.buscarPorNombreODescripcion(busqueda, busqueda).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductoDTO> obtenerPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    private ProductoDTO convertirADTO(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setCantidad(producto.getCantidad());
        dto.setUnidadMedida(producto.getUnidadMedida());
        dto.setCantidadMinima(producto.getCantidadMinima());
        dto.setFechaCaducidad(producto.getFechaCaducidad());
        dto.setPrecioUnitario(producto.getPrecioUnitario());
        dto.setProveedor(producto.getProveedor());
        dto.setCategoriaId(producto.getCategoria().getId());
        dto.setCategoriaNombre(producto.getCategoria().getNombre());
        dto.setFechaCreacion(producto.getFechaCreacion());
        dto.setFechaActualizacion(producto.getFechaActualizacion());
        
        // Calcular alertas
        if (producto.getCantidadMinima() != null) {
            dto.setBajoStock(producto.getCantidad().compareTo(producto.getCantidadMinima()) <= 0);
        }
        
        if (producto.getFechaCaducidad() != null) {
            LocalDate hoy = LocalDate.now();
            LocalDate fechaLimite = hoy.plusDays(7); // Alerta 7 días antes
            dto.setProximoAVencer(producto.getFechaCaducidad().isBefore(fechaLimite) || 
                                   producto.getFechaCaducidad().isEqual(fechaLimite));
        }
        
        return dto;
    }
    
    private Producto convertirAEntidad(ProductoDTO dto) {
        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setCantidad(dto.getCantidad());
        producto.setUnidadMedida(dto.getUnidadMedida());
        producto.setCantidadMinima(dto.getCantidadMinima());
        producto.setFechaCaducidad(dto.getFechaCaducidad());
        producto.setPrecioUnitario(dto.getPrecioUnitario());
        producto.setProveedor(dto.getProveedor());
        return producto;
    }
}

