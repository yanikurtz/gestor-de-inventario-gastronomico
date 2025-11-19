package com.inventarioGastro.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos_inventario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoInventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TipoMovimiento tipoMovimiento; // ENTRADA, SALIDA

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cantidad;

    @Column(name = "cantidad_anterior", precision = 10, scale = 2)
    private BigDecimal cantidadAnterior;

    @Column(name = "cantidad_nueva", precision = 10, scale = 2)
    private BigDecimal cantidadNueva;

    @Column(length = 255)
    private String motivo;

    @Column(length = 100)
    private String responsable;

    @Column(name = "fecha_movimiento")
    private LocalDateTime fechaMovimiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @PrePersist
    protected void onCreate() {
        fechaMovimiento = LocalDateTime.now();
    }

    public enum TipoMovimiento {
        ENTRADA,
        SALIDA
    }
}

