# Frontend React - Gestor de Inventario Gastronómico

Frontend desarrollado con React y Vite para el sistema de gestión de inventario gastronómico.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP para API
- **React Icons** - Iconos

## 📦 Instalación

1. Instalar dependencias:
```bash
cd frontend
npm install
```

## 🏃 Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

**Importante**: Asegúrate de que el backend Spring Boot esté ejecutándose en `http://localhost:8080`

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── pages/           # Páginas principales
│   │   ├── Categorias.jsx
│   │   ├── Productos.jsx
│   │   ├── Movimientos.jsx
│   │   └── Reportes.jsx
│   ├── services/        # Servicios API
│   │   └── api.js
│   ├── App.jsx          # Componente principal y routing
│   ├── App.css          # Estilos del layout
│   ├── index.css        # Estilos globales
│   └── main.jsx         # Punto de entrada
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Funcionalidades

### Categorías
- ✅ Listar todas las categorías
- ✅ Crear nueva categoría
- ✅ Editar categoría existente
- ✅ Eliminar categoría

### Productos
- ✅ Listar todos los productos
- ✅ Buscar productos por nombre/descripción
- ✅ Crear nuevo producto
- ✅ Editar producto existente
- ✅ Eliminar producto
- ✅ Visualizar alertas de bajo stock y caducidad

### Movimientos
- ✅ Listar todos los movimientos
- ✅ Registrar entrada de inventario
- ✅ Registrar salida de inventario
- ✅ Ver historial completo de movimientos

### Reportes
- ✅ Resumen general del inventario
- ✅ Total de productos
- ✅ Productos con bajo stock
- ✅ Productos próximos a vencer
- ✅ Valor total del inventario
- ✅ Lista de productos con alertas

## 🔧 Configuración

### Proxy API

El archivo `vite.config.js` está configurado para hacer proxy de las peticiones `/api` al backend:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  }
}
```

### Cambiar URL del Backend

Si tu backend está en otra URL, edita `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://tu-servidor:8080/api';
```

## 🏗️ Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 🎨 Características de Diseño

- ✅ Diseño responsivo (mobile-first)
- ✅ Sidebar colapsable en móviles
- ✅ Modales para formularios
- ✅ Tablas con scroll horizontal en móviles
- ✅ Badges para alertas y estados
- ✅ Iconos intuitivos
- ✅ Animaciones suaves

## 📱 Responsive

La aplicación es completamente responsiva:
- **Desktop**: Sidebar siempre visible
- **Tablet/Mobile**: Sidebar colapsable con overlay

## 🔗 Integración con Backend

El frontend está completamente integrado con el backend Spring Boot:
- Todas las operaciones CRUD funcionan
- Validaciones del backend se muestran al usuario
- Manejo de errores en tiempo real
- Estados de carga visuales

## 🐛 Solución de Problemas

### Error: "No se pudo conectar con el servidor"
- Verifica que el backend Spring Boot esté corriendo en `http://localhost:8080`
- Revisa que no haya errores de CORS (el backend ya tiene `@CrossOrigin` configurado)

### Error: "Network Error"
- Verifica la configuración del proxy en `vite.config.js`
- Asegúrate de que la URL en `src/services/api.js` sea correcta

### Los datos no se cargan
- Abre la consola del navegador (F12) para ver errores
- Verifica la pestaña Network para ver las peticiones HTTP
- Revisa que el backend esté respondiendo correctamente

## 📝 Próximas Mejoras

- [ ] Paginación en listados largos
- [ ] Filtros avanzados
- [ ] Exportar reportes a PDF/Excel
- [ ] Gráficos y visualizaciones
- [ ] Modo oscuro
- [ ] Autenticación y autorización
- [ ] Notificaciones push

