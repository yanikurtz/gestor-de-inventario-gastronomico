# Gestor de Inventario Gastronómico

Sistema de gestión de inventario para emprendimientos gastronómicos desarrollado con Spring Boot y arquitectura en capas.

## Arquitectura

El proyecto sigue una arquitectura en capas (Layered Architecture):

- **Capa de Presentación**: Controllers REST
- **Capa de Negocio**: Services con lógica de negocio
- **Capa de Acceso a Datos**: Repositories (Spring Data JPA)
- **Capa de Entidades**: Entities (JPA/Hibernate)

## Tecnologías Utilizadas

- Java 17
- Spring Boot 3.5.7
- Spring Data JPA
- H2 Database (en memoria, para desarrollo) o MySQL (para producción/WampServer)
- Lombok
- Bean Validation

## Estructura del Proyecto

```
demo/
├── entity/           # Entidades JPA (Categoria, Producto, MovimientoInventario)
├── repository/       # Repositorios (Spring Data JPA)
├── service/          # Lógica de negocio
├── controller/       # Controladores REST
├── dto/              # Data Transfer Objects
└── exception/        # Excepciones personalizadas y manejador global
```

## Características Principales

### Gestión de Categorías
- Crear, leer, actualizar y eliminar categorías
- Validación de nombres únicos

### Gestión de Productos
- CRUD completo de productos
- Control de stock con alertas de cantidad mínima
- Seguimiento de fechas de caducidad
- Búsqueda por nombre o descripción
- Filtrado por categoría

### Movimientos de Inventario
- Registro de entradas y salidas de productos
- Control de stock automático
- Validación de stock negativo
- Historial completo de movimientos

### Reportes
- Resumen de inventario
- Productos con bajo stock
- Productos próximos a vencer
- Valor total del inventario

## Configuración

### Base de Datos

El proyecto soporta dos opciones de base de datos:

#### Opción 1: H2 Database (por defecto - en memoria)

Configuración por defecto para desarrollo rápido:
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:inventariodb`
- Usuario: `sa`
- Contraseña: (vacía)
- **Ejecutar**: `mvn spring-boot:run`

#### Opción 2: MySQL con WampServer (recomendado para pruebas)

Para usar MySQL desde WampServer:
1. Asegúrate de que WampServer esté ejecutándose con MySQL iniciado
2. Ejecuta la aplicación con el perfil MySQL:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=mysql
   ```
3. La base de datos `inventario_gastronomico` se creará automáticamente
4. Puedes administrar los datos desde phpMyAdmin: http://localhost/phpmyadmin

**Nota**: Si tu MySQL tiene contraseña, edita `application-mysql.properties` y configura el usuario/contraseña.

📖 **Ver documentación completa**: [CONFIGURACION_WAMPSERVER.md](CONFIGURACION_WAMPSERVER.md)

### Propiedades de Aplicación

- `application.properties`: Configuración por defecto (H2)
- `application-mysql.properties`: Configuración para MySQL/WampServer

## API REST

### Endpoints de Categorías

- `GET /api/categorias` - Obtener todas las categorías
- `GET /api/categorias/{id}` - Obtener categoría por ID
- `POST /api/categorias` - Crear nueva categoría
- `PUT /api/categorias/{id}` - Actualizar categoría
- `DELETE /api/categorias/{id}` - Eliminar categoría

### Endpoints de Productos

- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/{id}` - Obtener producto por ID
- `GET /api/productos/categoria/{categoriaId}` - Obtener productos por categoría
- `GET /api/productos/bajo-stock` - Obtener productos con bajo stock
- `GET /api/productos/proximos-vencer?dias=7` - Obtener productos próximos a vencer
- `GET /api/productos/alertas?dias=7` - Obtener productos con alertas
- `GET /api/productos/buscar?busqueda=nombre` - Buscar productos
- `POST /api/productos` - Crear nuevo producto
- `PUT /api/productos/{id}` - Actualizar producto
- `DELETE /api/productos/{id}` - Eliminar producto

### Endpoints de Movimientos

- `GET /api/movimientos` - Obtener todos los movimientos
- `GET /api/movimientos/{id}` - Obtener movimiento por ID
- `GET /api/movimientos/producto/{productoId}` - Obtener movimientos de un producto
- `GET /api/movimientos/rango-fechas?fechaInicio=...&fechaFin=...` - Obtener movimientos por rango de fechas
- `POST /api/movimientos` - Crear nuevo movimiento (ENTRADA o SALIDA)

### Endpoints de Reportes

- `GET /api/reportes/inventario` - Generar reporte completo de inventario

## Ejemplos de Uso

### Crear una Categoría

```json
POST /api/categorias
{
  "nombre": "Lácteos",
  "descripcion": "Productos lácteos y derivados"
}
```

### Crear un Producto

```json
POST /api/productos
{
  "nombre": "Leche Entera",
  "descripcion": "Leche entera 1 litro",
  "cantidad": 50.0,
  "unidadMedida": "litros",
  "cantidadMinima": 10.0,
  "fechaCaducidad": "2024-12-31",
  "precioUnitario": 2.50,
  "proveedor": "Proveedor ABC",
  "categoriaId": 1
}
```

### Registrar Entrada de Inventario

```json
POST /api/movimientos
{
  "tipoMovimiento": "ENTRADA",
  "cantidad": 20.0,
  "motivo": "Compra a proveedor",
  "responsable": "Juan Pérez",
  "productoId": 1
}
```

### Registrar Salida de Inventario

```json
POST /api/movimientos
{
  "tipoMovimiento": "SALIDA",
  "cantidad": 5.0,
  "motivo": "Uso en cocina",
  "responsable": "María García",
  "productoId": 1
}
```

## Ejecución

1. Compilar el proyecto:
```bash
mvn clean install
```

2. Ejecutar la aplicación:

**Con H2 (por defecto)**:
```bash
mvn spring-boot:run
```

**Con MySQL (WampServer)**:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

La aplicación estará disponible en: http://localhost:8080

**Importante**: Si usas MySQL, asegúrate de que WampServer esté ejecutándose antes de iniciar la aplicación.

## Validaciones

- Los nombres de categorías y productos deben ser únicos
- Las cantidades deben ser mayores o iguales a 0
- No se permiten salidas de inventario que resulten en stock negativo
- No se puede eliminar una categoría que tenga productos asociados

## Manejo de Errores

El sistema incluye un manejador global de excepciones que retorna respuestas JSON estructuradas:

```json
{
  "status": 404,
  "message": "Producto con ID 100 no encontrado",
  "timestamp": "2024-01-15T10:30:00"
}
```

## Próximas Mejoras

- Autenticación y autorización
- Paginación en listados
- Exportación de reportes a PDF/Excel
- Integración con sistemas de facturación
- Notificaciones de alertas por email

