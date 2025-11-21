import { useState, useEffect } from 'react';
import { categoriaService } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const response = await categoriaService.getAll();
      setCategorias(response.data);
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
      if (editing) {
        await categoriaService.update(editing.id, formData);
        setSuccess('Categoría actualizada exitosamente');
      } else {
        await categoriaService.create(formData);
        setSuccess('Categoría creada exitosamente');
      }
      setShowModal(false);
      resetForm();
      loadCategorias();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (categoria) => {
    setEditing(categoria);
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    try {
      await categoriaService.delete(id);
      setSuccess('Categoría eliminada exitosamente');
      loadCategorias();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '' });
    setEditing(null);
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="loading">
        <FaSpinner style={{ animation: 'spin 1s linear infinite', fontSize: '32px' }} />
        <p>Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Categorías</h1>
          <button className="btn btn-primary" onClick={openModal}>
            <FaPlus /> Nueva Categoría
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {categorias.length === 0 ? (
          <div className="empty-state">
            <FaTags style={{ fontSize: '64px', opacity: 0.3, marginBottom: '16px' }} />
            <p>No hay categorías registradas</p>
            <button className="btn btn-primary" onClick={openModal} style={{ marginTop: '20px' }}>
              <FaPlus /> Crear primera categoría
            </button>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.id}</td>
                  <td><strong>{categoria.nombre}</strong></td>
                  <td>{categoria.descripcion || '-'}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(categoria)}
                      style={{ marginRight: '8px' }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(categoria.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal" onClick={(e) => e.target.className === 'modal' && closeModal()}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editing ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
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
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
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

export default Categorias;

