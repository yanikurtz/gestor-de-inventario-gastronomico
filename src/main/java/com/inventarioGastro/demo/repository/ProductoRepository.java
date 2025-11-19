package com.inventarioGastro.demo.repository;

import com.inventarioGastro.demo.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    Optional<Producto> findByNombre(String nombre);
    
    boolean existsByNombre(String nombre);
    
    @Query("SELECT p FROM Producto p WHERE p.categoria.id = :categoriaId")
    List<Producto> findByCategoriaId(@Param("categoriaId") Long categoriaId);
    
    @Query("SELECT p FROM Producto p WHERE p.cantidad <= p.cantidadMinima")
    List<Producto> findProductosBajoStock();
    
    @Query("SELECT p FROM Producto p WHERE p.fechaCaducidad <= :fecha AND p.fechaCaducidad IS NOT NULL")
    List<Producto> findProductosProximosAVencer(@Param("fecha") LocalDate fecha);
    
    @Query("SELECT p FROM Producto p WHERE p.cantidad <= p.cantidadMinima OR (p.fechaCaducidad <= :fecha AND p.fechaCaducidad IS NOT NULL)")
    List<Producto> findProductosConAlertas(@Param("fecha") LocalDate fecha);
    
    @Query("SELECT p FROM Producto p WHERE p.nombre LIKE CONCAT('%', :nombre, '%') OR p.descripcion LIKE CONCAT('%', :descripcion, '%')")
    List<Producto> buscarPorNombreODescripcion(@Param("nombre") String nombre, @Param("descripcion") String descripcion);
}

