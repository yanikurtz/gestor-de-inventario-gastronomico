package com.inventarioGastro.demo.dto;

import com.inventarioGastro.demo.entity.MovimientoInventario;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoInventarioDTO {
    
    private Long id;
    
    @NotNull(message = "El tipo de movimiento es obligatorio")
    private MovimientoInventario.TipoMovimiento tipoMovimiento;
    
    @NotNull(message = "La cantidad es obligatoria")
    @DecimalMin(value = "0.01", message = "La cantidad debe ser mayor a 0")
    private BigDecimal cantidad;
    
    private BigDecimal cantidadAnterior;
    private BigDecimal cantidadNueva;
    
    @Size(max = 255, message = "El motivo no puede exceder 255 caracteres")
    private String motivo;
    
    @Size(max = 100, message = "El responsable no puede exceder 100 caracteres")
    private String responsable;
    
    @NotNull(message = "El producto es obligatorio")
    private Long productoId;
    
    private String productoNombre;
    
    private LocalDateTime fechaMovimiento;
}

