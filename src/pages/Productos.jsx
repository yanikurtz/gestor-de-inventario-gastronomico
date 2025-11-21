import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService, categoriaService } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaExclamationTriangle, FaBox } from 'react-icons/fa';

function Productos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cantidad: '',
    unidadMedida: 'kg',
    cantidadMinima: '',
    fechaCaducidad: '',
    precioUnitario: '',
    proveedor: '',
    categoriaId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productosRes, categoriasRes] = await Promise.all([
        productoService.getAll(),
        categoriaService.getAll(),
      ]);
      setProductos(productosRes.data);
      setCategorias(categoriasRes.data);
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
        cantidadMinima: formData.cantidadMinima ? parseFloat(formData.cantidadMinima) : null,
        precioUnitario: formData.precioUnitario ? parseFloat(formData.precioUnitario) : null,
        fechaCaducidad: formData.fechaCaducidad || null,
        categoriaId: parseInt(formData.categoriaId),
      };

      if (editing) {
        await productoService.update(editing.id, data);
        setSuccess('Producto actualizado exitosamente');
      } else {
        await productoService.create(data);
        setSuccess('Producto creado exitosamente');
      }
      setShowModal(false);
      resetForm();
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (producto) => {
    setEditing(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      cantidad: producto.cantidad.toString(),
      unidadMedida: producto.unidadMedida,
      cantidadMinima: producto.cantidadMinima?.toString() || '',
      fechaCaducidad: producto.fechaCaducidad || '',
      precioUnitario: producto.precioUnitario?.toString() || '',
      proveedor: producto.proveedor || '',
      categoriaId: producto.categoriaId.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      await productoService.delete(id);
      setSuccess('Producto eliminado exitosamente');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadData();
      return;
    }
    
    try {
      setLoading(true);
      const response = await productoService.search(searchTerm);
      setProductos(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      cantidad: '',
      unidadMedida: 'kg',
      cantidadMinima: '',
      fechaCaducidad: '',
      precioUnitario: '',
      proveedor: '',
      categoriaId: categorias.length > 0 ? categorias[0].id.toString() : '',
    });
    setEditing(null);
  };

  const openModal = () => {
    if (categorias.length === 0) {
      setError('Primero debes crear al menos una categoría antes de poder crear productos.');
      return;
    }
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const filteredProductos = productos.filter((p) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(search) ||
      p.descripcion?.toLowerCase().includes(search) ||
      p.categoriaNombre?.toLowerCase().includes(search)
    );
  });

  if (loading && productos.length === 0) {
    return (
      <div className="loading">
        <FaSpinner style={{ animation: 'spin 1s linear infinite', fontSize: '32px' }} />
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <h1>Productos</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', minWidth: '200px' }}
              />
              <button className="btn btn-secondary" onClick={handleSearch}>
                <FaSearch />
              </button>
            </div>
            <button className="btn btn-primary" onClick={openModal}>
              <FaPlus /> Nuevo Producto
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {categorias.length === 0 && (
          <div
            className="alert"
            style={{
              background: '#d1ecf1',
              color: '#0c5460',
              border: '1px solid #bee5eb',
            }}
          >
            Aún no tienes categorías creadas. Debes crear al menos una categoría antes de poder
            asociarla a un producto.
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginLeft: '12px' }}
              onClick={() => navigate('/categorias')}
            >
              Ir a Categorías
            </button>
          </div>
        )}
        {success && <div className="alert alert-success">{success}</div>}

        {filteredProductos.length === 0 ? (
          <div className="empty-state">
            <FaBox style={{ fontSize: '64px', opacity: 0.3, marginBottom: '16px' }} />
            <p>No hay productos registrados</p>
            <button className="btn btn-primary" onClick={openModal} style={{ marginTop: '20px' }}>
              <FaPlus /> Crear primer producto
            </button>
          </div>
        ) : (
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
                  <th>Precio</th>
                  <th>Alertas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td><strong>{producto.nombre}</strong></td>
                    <td>{producto.categoriaNombre}</td>
                    <td>{producto.cantidad} {producto.unidadMedida}</td>
                    <td>{producto.cantidadMinima ? `${producto.cantidadMinima} ${producto.unidadMedida}` : '-'}</td>
                    <td>{producto.fechaCaducidad || '-'}</td>
                    <td>{producto.precioUnitario ? `$${producto.precioUnitario}` : '-'}</td>
                    <td>
                      {producto.bajoStock && (
                        <span className="badge badge-warning" title="Bajo stock">
                          <FaExclamationTriangle /> Stock
                        </span>
                      )}
                      {producto.proximoAVencer && (
                        <span className="badge badge-danger" title="Próximo a vencer">
                          <FaExclamationTriangle /> Caducidad
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(producto)}
                        style={{ marginRight: '8px' }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(producto.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal" onClick={(e) => e.target.className === 'modal' && closeModal()}>
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    value={formData.categoriaId}
                    onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Cantidad *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unidad de Medida *</label>
                  <select
                    value={formData.unidadMedida}
                    onChange={(e) => setFormData({ ...formData, unidadMedida: e.target.value })}
                    required
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="litros">litros</option>
                    <option value="ml">ml</option>
                    <option value="unidades">unidades</option>
                    <option value="cajas">cajas</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Cantidad Mínima</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cantidadMinima}
                    onChange={(e) => setFormData({ ...formData, cantidadMinima: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Fecha de Caducidad</label>
                  <input
                    type="date"
                    value={formData.fechaCaducidad}
                    onChange={(e) => setFormData({ ...formData, fechaCaducidad: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Precio Unitario</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precioUnitario}
                    onChange={(e) => setFormData({ ...formData, precioUnitario: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Proveedor</label>
                <input
                  type="text"
                  value={formData.proveedor}
                  onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;

