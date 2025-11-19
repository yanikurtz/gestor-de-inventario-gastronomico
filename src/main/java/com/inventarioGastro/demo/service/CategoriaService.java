package com.inventarioGastro.demo.service;

import com.inventarioGastro.demo.dto.CategoriaDTO;
import com.inventarioGastro.demo.entity.Categoria;
import com.inventarioGastro.demo.exception.BusinessException;
import com.inventarioGastro.demo.exception.ResourceNotFoundException;
import com.inventarioGastro.demo.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoriaService {
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    public List<CategoriaDTO> obtenerTodas() {
        return categoriaRepository.findAllOrderByNombre().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    public CategoriaDTO obtenerPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", id));
        return convertirADTO(categoria);
    }
    
    public CategoriaDTO crear(CategoriaDTO categoriaDTO) {
        if (categoriaRepository.existsByNombre(categoriaDTO.getNombre())) {
            throw new BusinessException("Ya existe una categoría con el nombre: " + categoriaDTO.getNombre());
        }
        
        Categoria categoria = convertirAEntidad(categoriaDTO);
        Categoria categoriaGuardada = categoriaRepository.save(categoria);
        return convertirADTO(categoriaGuardada);
    }
    
    public CategoriaDTO actualizar(Long id, CategoriaDTO categoriaDTO) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", id));
        
        // Verificar si el nuevo nombre ya existe en otra categoría
        if (!categoria.getNombre().equals(categoriaDTO.getNombre()) && 
            categoriaRepository.existsByNombre(categoriaDTO.getNombre())) {
            throw new BusinessException("Ya existe una categoría con el nombre: " + categoriaDTO.getNombre());
        }
        
        categoria.setNombre(categoriaDTO.getNombre());
        categoria.setDescripcion(categoriaDTO.getDescripcion());
        
        Categoria categoriaActualizada = categoriaRepository.save(categoria);
        return convertirADTO(categoriaActualizada);
    }
    
    public void eliminar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoría", id);
        }
        
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", id));
        
        // Verificar si tiene productos asociados
        if (categoria.getProductos() != null && !categoria.getProductos().isEmpty()) {
            throw new BusinessException("No se puede eliminar la categoría porque tiene productos asociados");
        }
        
        categoriaRepository.deleteById(id);
    }
    
    private CategoriaDTO convertirADTO(Categoria categoria) {
        CategoriaDTO dto = new CategoriaDTO();
        dto.setId(categoria.getId());
        dto.setNombre(categoria.getNombre());
        dto.setDescripcion(categoria.getDescripcion());
        dto.setFechaCreacion(categoria.getFechaCreacion());
        return dto;
    }
    
    private Categoria convertirAEntidad(CategoriaDTO dto) {
        Categoria categoria = new Categoria();
        categoria.setNombre(dto.getNombre());
        categoria.setDescripcion(dto.getDescripcion());
        return categoria;
    }
}

