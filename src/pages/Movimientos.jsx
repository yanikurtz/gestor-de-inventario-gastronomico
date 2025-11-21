import { useState, useEffect } from 'react';
import { movimientoService, productoService } from '../services/api';
import { FaPlus, FaSpinner, FaArrowUp, FaArrowDown } from 'react-icons/fa';

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tipoMovimiento: 'ENTRADA',
    cantidad: '',
    motivo: '',
    responsable: '',
    productoId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [movimientosRes, productosRes] = await Promise.all([
        movimientoService.getAll(),
        productoService.getAll(),
      ]);
      
      // Ordenar movimientos por fecha más reciente
      const sorted = movimientosRes.data.sort((a, b) => 
        new Date(b.fechaMovimiento) - new Date(a.fechaMovimiento)
      );
      setMovimientos(sorted);
      setProductos(productosRes.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const data = {
        ...formData,
        cantidad: parseFloat(formData.cantidad),
        productoId: parseInt(formData.productoId),
      };

      await movimientoService.create(data);
      setSuccess('Movimiento registrado exitosamente');
      setShowModal(false);
      resetForm();
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      tipoMovimiento: 'ENTRADA',
      cantidad: '',
      motivo: '',
      responsable: '',
      productoId: productos.length > 0 ? productos[0].id.toString() : '',
    });
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading && movimientos.length === 0) {
    return (
      <div className="loading">
        <FaSpinner style={{ animation: 'spin 1s linear infinite', fontSize: '32px' }} />
        <p>Cargando movimientos...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Movimientos de Inventario</h1>
          <button className="btn btn-primary" onClick={openModal}>
            <FaPlus /> Nuevo Movimiento
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {movimientos.length === 0 ? (
          <div className="empty-state">
            <FaArrowUp style={{ fontSize: '64px', opacity: 0.3, marginBottom: '16px' }} />
            <p>No hay movimientos registrados</p>
            <button className="btn btn-primary" onClick={openModal} style={{ marginTop: '20px' }}>
              <FaPlus /> Registrar primer movimiento
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Cantidad Anterior</th>
                  <th>Cantidad Nueva</th>
                  <th>Motivo</th>
                  <th>Responsable</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((movimiento) => (
                  <tr key={movimiento.id}>
                    <td>{movimiento.id}</td>
                    <td>{formatDate(movimiento.fechaMovimiento)}</td>
                    <td><strong>{movimiento.productoNombre}</strong></td>
                    <td>
                      {movimiento.tipoMovimiento === 'ENTRADA' ? (
                        <span className="badge badge-success">
                          <FaArrowUp /> ENTRADA
                        </span>
                      ) : (
                        <span className="badge badge-danger">
                          <FaArrowDown /> SALIDA
                        </span>
                      )}
                    </td>
                    <td>{movimiento.cantidad}</td>
                    <td>{movimiento.cantidadAnterior}</td>
                    <td><strong>{movimiento.cantidadNueva}</strong></td>
                    <td>{movimiento.motivo || '-'}</td>
                    <td>{movimiento.responsable || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal" onClick={(e) => e.target.className === 'modal' && closeModal()}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Nuevo Movimiento</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Producto *</label>
                <select
                  value={formData.productoId}
                  onChange={(e) => setFormData({ ...formData, productoId: e.target.value })}
                  required
                >
                  <option value="">Seleccione un producto...</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre} ({producto.cantidad} {producto.unidadMedida})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Tipo de Movimiento *</label>
                <select
                  value={formData.tipoMovimiento}
                  onChange={(e) => setFormData({ ...formData, tipoMovimiento: e.target.value })}
                  required
                >
                  <option value="ENTRADA">ENTRADA</option>
                  <option value="SALIDA">SALIDA</option>
                </select>
              </div>
              <div className="form-group">
                <label>Cantidad *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Motivo</label>
                <textarea
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  placeholder="Ej: Compra a proveedor, Uso en cocina, etc."
                />
              </div>
              <div className="form-group">
                <label>Responsable</label>
                <input
                  type="text"
                  value={formData.responsable}
                  onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                  placeholder="Nombre de la persona responsable"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movimientos;

