package com.inventarioGastro.demo.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {
    
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;
    
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String descripcion;
    
    @NotNull(message = "La cantidad es obligatoria")
    @DecimalMin(value = "0.0", inclusive = true, message = "La cantidad debe ser mayor o igual a 0")
    private BigDecimal cantidad;
    
    @NotBlank(message = "La unidad de medida es obligatoria")
    @Size(max = 50, message = "La unidad de medida no puede exceder 50 caracteres")
    private String unidadMedida;
    
    @DecimalMin(value = "0.0", inclusive = true, message = "La cantidad mínima debe ser mayor o igual a 0")
    private BigDecimal cantidadMinima;
    
    private LocalDate fechaCaducidad;
    
    @DecimalMin(value = "0.0", inclusive = true, message = "El precio unitario debe ser mayor o igual a 0")
    private BigDecimal precioUnitario;
    
    @Size(max = 100, message = "El proveedor no puede exceder 100 caracteres")
    private String proveedor;
    
    @NotNull(message = "La categoría es obligatoria")
    private Long categoriaId;
    
    private String categoriaNombre;
    
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    
    private boolean bajoStock;
    private boolean proximoAVencer;
}

