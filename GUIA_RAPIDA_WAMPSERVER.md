# 🚀 Guía Rápida: Conectar con WampServer

## ✅ Pasos Rápidos

### 1️⃣ Verificar WampServer
- ✅ Asegúrate de que WampServer esté **corriendo** (ícono verde)
- ✅ Verifica que **MySQL esté iniciado** (clic derecho en ícono WampServer → MySQL → Service → Start/Resume)

### 2️⃣ Configurar Contraseña (SOLO si tu MySQL tiene contraseña)

Si tu MySQL tiene contraseña para el usuario `root`, edita este archivo:
📁 `src/main/resources/application-mysql.properties`

Cambia esta línea:
```properties
spring.datasource.password=tu_contraseña_aqui
```

**Si NO tienes contraseña**, déjalo como está (vacío):
```properties
spring.datasource.password=
```

### 3️⃣ Ejecutar la Aplicación con MySQL

#### **Opción A: Desde IntelliJ IDEA**

1. Clic derecho en `DemoApplication.java`
2. Selecciona **"Modify Run Configuration..."** o ve a **Run → Edit Configurations...**
3. En **"Program arguments"** o **"VM options"**, agrega:
   ```
   --spring.profiles.active=mysql
   ```
4. Clic en **OK**
5. Ejecuta la aplicación con ▶️ Run

#### **Opción B: Desde VS Code**

1. Abre la terminal integrada (Ctrl + `)
2. Ejecuta:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=mysql
   ```

#### **Opción C: Desde línea de comandos (CMD/PowerShell)**

```bash
cd demo
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

### 4️⃣ Verificar que Funciona

Una vez que la aplicación inicie:

1. **En la consola deberías ver:**
   ```
   Hibernate: create table categorias ...
   Hibernate: create table productos ...
   Hibernate: create table movimientos_inventario ...
   ```

2. **Abre phpMyAdmin:**
   - Ve a: http://localhost/phpmyadmin
   - Selecciona la base de datos `inventario_gastronomico` en el menú lateral
   - Deberías ver las 3 tablas creadas automáticamente

3. **Prueba la API:**
   - Abre: http://localhost:8080/
   - Deberías ver la página HTML de la API

## 🔍 Verificar Conexión en phpMyAdmin

1. Abre: http://localhost/phpmyadmin
2. En el panel izquierdo, busca `inventario_gastronomico`
3. Haz clic en ella
4. Deberías ver las tablas:
   - ✅ `categorias`
   - ✅ `productos`
   - ✅ `movimientos_inventario`

## ⚠️ Solución de Problemas

### Error: "Access denied for user 'root'@'localhost'"
**Solución:**
- Abre `application-mysql.properties`
- Verifica que `spring.datasource.username=root`
- Si tu MySQL tiene contraseña, agrega: `spring.datasource.password=tu_contraseña`

### Error: "Can't connect to MySQL server"
**Solución:**
1. Verifica que WampServer esté corriendo (ícono verde)
2. Verifica que MySQL esté iniciado:
   - Clic derecho en ícono WampServer
   - MySQL → Service → Start/Resume
3. Verifica el puerto 3306 está libre

### Las tablas no se crean
**Solución:**
- Verifica en la consola que no haya errores
- Asegúrate de que `createDatabaseIfNotExist=true` esté en la URL
- Revisa los logs de la aplicación

### La base de datos no se crea automáticamente
**Solución manual:**
1. Abre phpMyAdmin: http://localhost/phpmyadmin
2. Clic en "Nueva" en el panel lateral
3. Nombre: `inventario_gastronomico`
4. Collation: `utf8mb4_general_ci`
5. Clic en "Crear"

## 📝 Resumen

**Para usar MySQL con WampServer:**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

**Para volver a H2 (memoria):**
```bash
mvn spring-boot:run
```

## ✨ Ventajas de MySQL con WampServer

- ✅ Datos **persistentes** (no se pierden al reiniciar)
- ✅ Administración visual con **phpMyAdmin**
- ✅ Puedes hacer **backups** fácilmente
- ✅ **Exportar/importar** datos
- ✅ Mejor para **pruebas reales**

