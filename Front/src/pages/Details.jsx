import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonNav from '../components/ButtonNav';
import { getDetalleBoleta } from '../api/api';
import '../styles/Details.scss';

const Details = () => {
  const navigate = useNavigate();
  const [detalleRetiro, setDetalleRetiro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 's2 | Detalles';
    const boletaId = localStorage.getItem('detalle_boleta_id');
    if (!boletaId) {
      setError('No se encontró información del retiro. Vuelve al dashboard.');
      setCargando(false);
      return;
    }
    cargarDetalle(boletaId);
  }, []);

  const cargarDetalle = async (boletaId) => {
    try {
      const data = await getDetalleBoleta(boletaId);
      setDetalleRetiro(data);
    } catch {
      setError('No se pudo cargar el detalle del retiro.');
    } finally {
      setCargando(false);
    }
  };

  const determinarClaseBanner = (estado) => {
    if (estado === 'Retirado') return 'banner-verde';
    if (estado === 'Rechazado') return 'banner-rojo';
    return 'banner-naranja';
  };

  if (cargando) {
    return (
      <main className="details-page-wrapper">
        <div className="details-content-card">
          <p style={{ textAlign: 'center', padding: '40px' }}>Cargando detalle...</p>
        </div>
      </main>
    );
  }

  if (error || !detalleRetiro) {
    return (
      <main className="details-page-wrapper">
        <div className="details-content-card">
          <p style={{ textAlign: 'center', padding: '40px', color: '#842029' }}>{error}</p>
          <div style={{ textAlign: 'center' }}>
            <ButtonNav ruta="/dashboard" texto="Volver al Dashboard" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="details-page-wrapper">
      <div className="details-content-card">
        <h1 className="titulo-pagina">Resumen Retiro</h1>
        <section className={`banner-estado ${determinarClaseBanner(detalleRetiro.estado_general)}`}>
          <h2>Estado: {detalleRetiro.estado_general}</h2>
        </section>

        <div className="layout-dos-columnas">
          <aside className="columna-info-basica">
            <div className="caja-dato"><span className="label">Cliente:</span> {detalleRetiro.info_basica.cliente}</div>
            <div className="caja-dato"><span className="label">Sede de retiro:</span> {detalleRetiro.info_basica.sede}</div>
            <div className="caja-dato"><span className="label">Boleta (id):</span> {detalleRetiro.info_basica.boleta_id}</div>
            <div className="caja-dato"><span className="label">Fecha:</span> {detalleRetiro.info_basica.fecha}</div>
            <div className="caja-dato"><span className="label">Hora:</span> {detalleRetiro.info_basica.hora}</div>
            <div className="caja-dato"><span className="label">Operador:</span> {detalleRetiro.info_basica.operador}</div>
            <div className="btn-volver-container">
              <ButtonNav ruta="/dashboard" texto="Volver al Dashboard" />
            </div>
          </aside>

          <section className="columna-detalles">
            <article className="tabla-productos-resumen">
              <table className="tabla-limpia">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {detalleRetiro.productos.map((prod) => (
                    <tr key={prod.id}>
                      <td>{prod.codigo}</td>
                      <td>{prod.nombre}</td>
                      <td>{prod.categoria}</td>
                      <td className={`estado-icono ${prod.entregado ? 'exito' : 'error'}`}>
                        {prod.entregado ? (
                          <span title="Entregado">✅</span>
                        ) : (
                          <span title={`Problema: ${prod.causa}`}>❌ {prod.causa}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>

            {detalleRetiro.foto_respaldo && (
              <article className="foto-boleta-container">
                <h3>Foto de respaldo</h3>
                <img
                  src={detalleRetiro.foto_respaldo}
                  alt="Foto de respaldo del retiro"
                  className="imagen-boleta"
                />
              </article>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Details;
