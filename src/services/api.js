import axios from 'axios';

// Permite configurar la URL base de la API por entorno (Vite)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      throw new Error(error.response.data.message || 'Error en la petición');
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      throw new Error('No se pudo conectar con el servidor');
    } else {
      // Algo más causó el error
      throw new Error(error.message);
    }
  }
);

// Servicio de Categorías
export const categoriaService = {
  getAll: () => api.get('/categorias'),
  getById: (id) => api.get(`/categorias/${id}`),
  create: (data) => api.post('/categorias', data),
  update: (id, data) => api.put(`/categorias/${id}`, data),
  delete: (id) => api.delete(`/categorias/${id}`),
};

// Servicio de Productos
export const productoService = {
  getAll: () => api.get('/productos'),
  getById: (id) => api.get(`/productos/${id}`),
  getByCategoria: (categoriaId) => api.get(`/productos/categoria/${categoriaId}`),
  getBajoStock: () => api.get('/productos/bajo-stock'),
  getProximosAVencer: (dias = 7) => api.get(`/productos/proximos-vencer?dias=${dias}`),
  getAlertas: (dias = 7) => api.get(`/productos/alertas?dias=${dias}`),
  search: (busqueda) => api.get(`/productos/buscar?busqueda=${busqueda}`),
  create: (data) => api.post('/productos', data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  delete: (id) => api.delete(`/productos/${id}`),
};

// Servicio de Movimientos
export const movimientoService = {
  getAll: () => api.get('/movimientos'),
  getById: (id) => api.get(`/movimientos/${id}`),
  getByProducto: (productoId) => api.get(`/movimientos/producto/${productoId}`),
  getByRangoFechas: (fechaInicio, fechaFin) => 
    api.get(`/movimientos/rango-fechas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`),
  create: (data) => api.post('/movimientos', data),
};

// Servicio de Reportes
export const reporteService = {
  getInventario: () => api.get('/reportes/inventario'),
};

export default api;

