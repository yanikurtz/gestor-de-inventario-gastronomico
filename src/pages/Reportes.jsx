import { useState, useEffect } from 'react';
import { reporteService } from '../services/api';
import { FaSpinner, FaExclamationTriangle, FaCalendarAlt, FaDollarSign, FaBox } from 'react-icons/fa';

function Reportes() {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReporte();
  }, []);

  const loadReporte = async () => {
    try {
      setLoading(true);
      const response = await reporteService.getInventario();
      setReporte(response.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <FaSpinner style={{ animation: 'spin 1s linear infinite', fontSize: '32px' }} />
        <p>Cargando reporte...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-primary" onClick={loadReporte} style={{ marginTop: '20px' }}>
          Reintentar
        </button>
      </div>
    );
  }

  if (!reporte) {
    return null;
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Reporte de Inventario</h1>
          <button className="btn btn-primary" onClick={loadReporte}>
            Actualizar
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <FaBox style={{ fontSize: '32px', color: '#667eea' }} />
              <div>
                <h3 style={{ margin: 0, color: '#333' }}>Total Productos</h3>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>En inventario</p>
              </div>
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>
              {reporte.totalProductos}
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <FaExclamationTriangle style={{ fontSize: '32px', color: '#ffc107' }} />
              <div>
                <h3 style={{ margin: 0, color: '#333' }}>Bajo Stock</h3>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>Requieren atención</p>
              </div>
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffc107' }}>
              {reporte.productosBajoStock}
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <FaCalendarAlt style={{ fontSize: '32px', color: '#dc3545' }} />
              <div>
                <h3 style={{ margin: 0, color: '#333' }}>Próximos a Vencer</h3>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>En los próximos 7 días</p>
              </div>
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#dc3545' }}>
              {reporte.productosProximosAVencer}
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <FaDollarSign style={{ fontSize: '32px', color: '#28a745' }} />
              <div>
                <h3 style={{ margin: 0, color: '#333' }}>Valor Total</h3>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>Del inventario</p>
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>
              ${reporte.valorTotalInventario ? parseFloat(reporte.valorTotalInventario).toFixed(2) : '0.00'}
            </div>
          </div>
        </div>

        {reporte.productosConAlertas && reporte.productosConAlertas.length > 0 && (
          <div className="card">
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Productos con Alertas</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Cantidad</th>
                    <th>Mínimo</th>
                    <th>Caducidad</th>
                    <th>Alertas</th>
                  </tr>
                </thead>
                <tbody>
                  {reporte.productosConAlertas.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.id}</td>
                      <td><strong>{producto.nombre}</strong></td>
                      <td>{producto.categoriaNombre}</td>
                      <td>{producto.cantidad} {producto.unidadMedida}</td>
                      <td>{producto.cantidadMinima ? `${producto.cantidadMinima} ${producto.unidadMedida}` : '-'}</td>
                      <td>{producto.fechaCaducidad || '-'}</td>
                      <td>
                        {producto.bajoStock && (
                          <span className="badge badge-warning" title="Bajo stock">
                            <FaExclamationTriangle /> Stock
                          </span>
                        )}
                        {producto.proximoAVencer && (
                          <span className="badge badge-danger" title="Próximo a vencer">
                            <FaCalendarAlt /> Caducidad
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(!reporte.productosConAlertas || reporte.productosConAlertas.length === 0) && (
          <div className="card">
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <FaBox style={{ fontSize: '64px', opacity: 0.3, marginBottom: '16px' }} />
              <p>No hay productos con alertas en este momento</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reportes;

