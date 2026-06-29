import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonNav from '../components/ButtonNav';
import { getDashboard, logoutApi } from '../api/api';
import '../styles/Details.scss';
import '../styles/Dashboard.scss';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ entregados: 0, pendientes: 0, rechazados: 0 });
  const [boletas, setBoletas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    document.title = 's2 | Dashboard';
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await getDashboard();
      setStats(data.stats);
      setBoletas(data.boletas);
    } catch {
      navigate('/login');
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = async () => {
    await logoutApi();
    navigate('/');
  };

  const verDetalle = (boleta) => {
    localStorage.setItem('detalle_boleta_id', boleta.boleta_db_id);
    navigate('/details');
  };

  return (
    <section className="details-page-wrapper">
      <div className="details-content-card">
        <div className="dashboard-header">
          <div className="header-left">
            <button onClick={handleLogout} className="Navbutton">Logout</button>
            <h1 className="titulo-seccion">Retiros de hoy</h1>
          </div>
          <ButtonNav ruta="/contact" texto="Contacto/soporte" />
        </div>

        <div className="indicadores-container">
          <div className="banner-estado banner-verde">
            <label>Pedidos entregados hoy</label>
            <h2>{cargando ? '...' : stats.entregados}</h2>
          </div>
          <div className="banner-estado banner-naranja">
            <label>Pedidos pendientes</label>
            <h2>{cargando ? '...' : stats.pendientes}</h2>
          </div>
          <div className="banner-estado banner-rojo">
            <label>Pedidos rechazados</label>
            <h2>{cargando ? '...' : stats.rechazados}</h2>
          </div>
        </div>

        <div className="btn-registrar-container">
          <ButtonNav ruta="/checklist" texto="Registrar" />
        </div>

        <div className="columna-detalles">
          <table className="tabla-limpia">
            <thead>
              <tr>
                <th>Boleta (id)</th>
                <th>Producto principal</th>
                <th>Cantidad</th>
                <th>Cliente</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {!cargando && boletas.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>
                    No hay boletas registradas.
                  </td>
                </tr>
              )}
              {boletas.map((boleta, index) => {
                let filaClase = 'fila-verde';
                if (boleta.estado === 'pendiente') filaClase = 'fila-amarilla';
                if (boleta.estado === 'rechazado') filaClase = 'fila-roja';

                return (
                  <tr key={index} className={filaClase}>
                    <td><strong>{boleta.id}</strong></td>
                    <td>{boleta.producto}</td>
                    <td>{boleta.cantidad}</td>
                    <td>{boleta.cliente}</td>
                    <td>
                      <div className="celda-boton-detalle">
                        <button
                          onClick={() => verDetalle(boleta)}
                          className={`btn-detalle-tabla ${boleta.estado}`}
                        >
                          DETALLES
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
