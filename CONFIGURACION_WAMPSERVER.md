# Configuración para WampServer (MySQL)

Este documento explica cómo configurar la aplicación para usar MySQL desde WampServer en lugar de H2.

## Pasos de Configuración

### 1. Iniciar WampServer

1. Abre WampServer en tu sistema
2. Asegúrate de que el servicio MySQL esté en ejecución (ícono verde)
3. Verifica que MySQL esté escuchando en el puerto 3306 (por defecto)

### 2. Crear Base de Datos en MySQL

Tienes dos opciones:

#### Opción A: La aplicación crea la base de datos automáticamente
- Solo asegúrate de que el usuario `root` tenga permisos para crear bases de datos
- La aplicación creará automáticamente la base de datos `inventario_gastronomico`

#### Opción B: Crear manualmente con phpMyAdmin

1. Abre phpMyAdmin desde WampServer: http://localhost/phpmyadmin
2. Haz clic en "Nueva" (New) en el panel lateral
3. Ingresa el nombre: `inventario_gastronomico`
4. Selecciona el collation: `utf8mb4_general_ci`
5. Haz clic en "Crear" (Create)

### 3. Configurar Credenciales MySQL

Si tu MySQL tiene contraseña configurada para el usuario `root`, edita el archivo:
- `src/main/resources/application-mysql.properties`

Y actualiza estas líneas según tu configuración:
```properties
spring.datasource.username=root
spring.datasource.password=tu_contraseña_aqui
```

### 4. Ejecutar la Aplicación con Perfil MySQL

#### Opción A: Desde IntelliJ/Eclipse
1. Ve a Run/Debug Configurations
2. En "Program arguments" o "VM options", agrega:
   ```
   --spring.profiles.active=mysql
   ```
3. Ejecuta la aplicación

#### Opción B: Desde la línea de comandos
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

#### Opción C: JAR compilado
```bash
java -jar demo-0.0.1-SNAPSHOT.jar --spring.profiles.active=mysql
```

### 5. Verificar la Conexión

Una vez iniciada la aplicación:
1. Deberías ver mensajes SQL en la consola
2. Las tablas se crearán automáticamente en la base de datos
3. Puedes verificar en phpMyAdmin que las tablas se hayan creado:
   - `categorias`
   - `productos`
   - `movimientos_inventario`

## Verificar en phpMyAdmin

1. Abre: http://localhost/phpmyadmin
2. Selecciona la base de datos `inventario_gastronomico`
3. Deberías ver las tablas creadas automáticamente por JPA/Hibernate

## Cambiar entre H2 y MySQL

- **Para usar H2 (memoria)**: No especifiques perfil o usa `--spring.profiles.active=default`
- **Para usar MySQL**: Usa `--spring.profiles.active=mysql`

## Configuración del Puerto MySQL

Si WampServer usa un puerto diferente a 3306, edita `application-mysql.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:TU_PUERTO/inventario_gastronomico?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

## Solución de Problemas

### Error: "Access denied for user 'root'@'localhost'"
- Verifica que el usuario y contraseña sean correctos en `application-mysql.properties`
- Si no tienes contraseña, deja `spring.datasource.password=` vacío

### Error: "Unknown database 'inventario_gastronomico'"
- Asegúrate de que `createDatabaseIfNotExist=true` esté en la URL
- O crea la base de datos manualmente en phpMyAdmin

### Error: "Can't connect to MySQL server"
- Verifica que WampServer esté ejecutándose
- Verifica que MySQL esté iniciado (ícono verde)
- Verifica el puerto (por defecto 3306)

### Las tablas no se crean
- Verifica que `spring.jpa.hibernate.ddl-auto=update` esté configurado
- Revisa los logs de la aplicación para ver errores SQL

## Beneficios de usar MySQL con WampServer

- ✅ Base de datos persistente (los datos no se pierden al reiniciar)
- ✅ Puedes usar phpMyAdmin para administrar los datos visualmente
- ✅ Mejor para desarrollo y pruebas reales
- ✅ Puedes hacer backup fácilmente desde phpMyAdmin
- ✅ Puedes exportar/importar datos fácilmente

