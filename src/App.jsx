import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaHome, FaBox, FaTags, FaExchangeAlt, FaChartBar, FaBars, FaTimes } from 'react-icons/fa';
import api, { reporteService } from './services/api';
import Categorias from './pages/Categorias';
import Productos from './pages/Productos';
import Movimientos from './pages/Movimientos';
import Reportes from './pages/Reportes';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="app">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <TopBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/movimientos" element={<Movimientos />} />
              <Route path="/reportes" element={<Reportes />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

function Sidebar({ open, setOpen }) {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Inicio' },
    { path: '/categorias', icon: FaTags, label: 'Categorías' },
    { path: '/productos', icon: FaBox, label: 'Productos' },
    { path: '/movimientos', icon: FaExchangeAlt, label: 'Movimientos' },
    { path: '/reportes', icon: FaChartBar, label: 'Reportes' },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'active' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>🍽️ Inventario</h2>
          <button className="close-sidebar" onClick={() => setOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function TopBar({ toggleSidebar }) {
  return (
    <header className="topbar">
      <button className="menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <h1>Gestor de Inventario Gastronómico</h1>
    </header>
  );
}

function Home() {
  const [apiInfo, setApiInfo] = useState(null);
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const [infoRes, reporteRes] = await Promise.all([
          api.get('/info'),
          reporteService.getInventario(),
        ]);
        setApiInfo(infoRes.data);
        setReporte(reporteRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1>Bienvenido al Gestor de Inventario Gastronómico</h1>
        <p style={{ marginTop: '16px', color: '#666', lineHeight: '1.6' }}>
          Sistema de gestión de inventario para emprendimientos gastronómicos.
          Administra tus productos, categorías, movimientos de inventario y genera reportes detallados.
        </p>

        {error && <div className="alert alert-error" style={{ marginTop: '20px' }}>{error}</div>}

        {loading && !apiInfo && !reporte && (
          <p style={{ marginTop: '20px', color: '#666' }}>Cargando datos del sistema...</p>
        )}

        {!loading && apiInfo && reporte && (
          <div
            style={{
              marginTop: '32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            <div className="stat-card">
              <h3 style={{ margin: 0, color: '#333' }}>Estado de la API</h3>
              <p style={{ margin: '8px 0 0', color: '#666', fontSize: '14px' }}>
                {apiInfo.descripcion}
              </p>
              <p style={{ marginTop: '12px', fontSize: '14px', color: '#888' }}>
                Versión: <strong>{apiInfo.version}</strong>
              </p>
            </div>

            <div className="stat-card">
              <h3 style={{ margin: 0, color: '#333' }}>Resumen de Inventario</h3>
              <p style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
                Productos totales: <strong>{reporte.totalProductos}</strong>
              </p>
              <p style={{ marginTop: '4px', fontSize: '14px', color: '#666' }}>
                Bajo stock: <strong>{reporte.productosBajoStock}</strong>
              </p>
              <p style={{ marginTop: '4px', fontSize: '14px', color: '#666' }}>
                Próximos a vencer (7 días):{' '}
                <strong>{reporte.productosProximosAVencer}</strong>
              </p>
            </div>

            <div className="stat-card">
              <h3 style={{ margin: 0, color: '#333' }}>Valor del Inventario</h3>
              <p style={{ marginTop: '12px', fontSize: '22px', fontWeight: 'bold', color: '#28a745' }}>
                $
                {reporte.valorTotalInventario
                  ? parseFloat(reporte.valorTotalInventario).toFixed(2)
                  : '0.00'}
              </p>
              <p style={{ marginTop: '4px', fontSize: '13px', color: '#777' }}>
                Basado en el precio unitario registrado de cada producto.
              </p>
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: '32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
          }}
        >
          <Link to="/categorias" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="feature-card">
              <FaTags style={{ fontSize: '32px', color: '#667eea', marginBottom: '12px' }} />
              <h3>Categorías</h3>
              <p>Organiza tus productos por categorías</p>
            </div>
          </Link>
          <Link to="/productos" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="feature-card">
              <FaBox style={{ fontSize: '32px', color: '#667eea', marginBottom: '12px' }} />
              <h3>Productos</h3>
              <p>Gestiona tu inventario de productos</p>
            </div>
          </Link>
          <Link to="/movimientos" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="feature-card">
              <FaExchangeAlt style={{ fontSize: '32px', color: '#667eea', marginBottom: '12px' }} />
              <h3>Movimientos</h3>
              <p>Registra entradas y salidas</p>
            </div>
          </Link>
          <Link to="/reportes" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="feature-card">
              <FaChartBar style={{ fontSize: '32px', color: '#667eea', marginBottom: '12px' }} />
              <h3>Reportes</h3>
              <p>Visualiza estadísticas y alertas</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;

