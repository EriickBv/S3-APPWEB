import { useState, useEffect } from 'react';
import ButtonNav from '../components/ButtonNav';
import '../styles/Details.scss'; 

const Details = () => {
  
  useEffect(() => {
      document.title = "s2 | Detalles";
    }, []);
  
  const detalleRetiro = {
    estadoGeneral: 'Retirado parcialmente', 
    infoBasica: {
      cliente: 'Carlos Mendoza',
      sede: 'Sede Providencia',
      boletaId: 'SKU-99812',
      fecha: '04-06-2026',
      hora: '14:30',
      operador: 'Operador de Turno'
    },
    productos: [
      { id: 1, codigo: 'SKU-100', nombre: 'Monitor 24"', categoria: 'Electrónica', entregado: true, causa: null },
      { id: 2, codigo: 'SKU-101', nombre: 'Teclado Mecánico', categoria: 'Accesorios', entregado: false, causa: 'Sin stock' },
      { id: 3, codigo: 'SKU-102', nombre: 'Mouse Inalámbrico', categoria: 'Accesorios', entregado: true, causa: null },
      { id: 4, codigo: 'SKU-103', nombre: 'Cable HDMI 2m', categoria: 'Cables', entregado: false, causa: 'Dañado' }
    ],
  };

  const determinarClaseBanner = (estado) => {
    if (estado === 'Retirado') return 'banner-verde';
    if (estado === 'Rechazado') return 'banner-rojo';
    return 'banner-naranja'; // Para "Retirado parcialmente"
  };

  return (
    <main className="details-page-wrapper">
      <div className="details-content-card">
        <h1 className="titulo-pagina">Resumen Retiro</h1>
        <section className={`banner-estado ${determinarClaseBanner(detalleRetiro.estadoGeneral)}`}>
          <h2>Estado: {detalleRetiro.estadoGeneral}</h2>
        </section>

        <div className="layout-dos-columnas">
          <aside className="columna-info-basica">
            <div className="caja-dato"><span className="label">Cliente:</span> {detalleRetiro.infoBasica.cliente}</div>
            <div className="caja-dato"><span className="label">Sede de retiro:</span> {detalleRetiro.infoBasica.sede}</div>
            <div className="caja-dato"><span className="label">Boleta (id):</span> {detalleRetiro.infoBasica.boletaId}</div>
            <div className="caja-dato"><span className="label">Fecha:</span> {detalleRetiro.infoBasica.fecha}</div>
            <div className="caja-dato"><span className="label">Hora:</span> {detalleRetiro.infoBasica.hora}</div>
            <div className="caja-dato"><span className="label">Operador:</span> {detalleRetiro.infoBasica.operador}</div>
            
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
                    <th>Productos</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {detalleRetiro.productos.map(prod => (
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

            <article className="foto-boleta-container">
              <h3>Boleta (foto)</h3>
              <img 
                src={detalleRetiro.fotoBoleta} 
                alt={`Boleta escaneada para el ID ${detalleRetiro.infoBasica.boletaId}`} 
                className="imagen-boleta"
              />
            </article>

          </section>
        </div>
      </div>
    </main>
  );
};

export default Details;