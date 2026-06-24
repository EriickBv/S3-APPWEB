import '../App.css';
import { useState, useEffect } from 'react';
import ButtonNav from '../components/ButtonNav';

function Dashboard() {

    useEffect(() => {
        document.title = "s2 | Dashboard";
    }, []);
    
    const pedidos = [
        { id: "SKU-99812", producto: "Monitor 24\"", cantidad: 1, cliente: "Carlos Mendoza", estado: "entregado" },
        { id: "SKU-99813", producto: "Teclado Mecánico", cantidad: 1, cliente: "Ana Silva", estado: "rechazado" },
        { id: "SKU-99814", producto: "Mouse Inalámbrico", cantidad: 2, cliente: "Diego Muñoz", estado: "entregado" },
        { id: "SKU-99815", producto: "Cable HDMI 2m", cantidad: 4, cliente: "María Cuevas", estado: "pendiente" },
        { id: "SKU-99816", producto: "Audífonos Gamer", cantidad: 1, cliente: "Juan Pérez", estado: "entregado" },
    ];

    return (
        <section className="details-page-wrapper">
            <div className="details-content-card">
                
                <div className="dashboard-header">
                    <div className="header-left">
                        <ButtonNav ruta={'/'} texto={'Logout'} className="btn-logout" />
                        <h1 className="titulo-seccion">Retiros de hoy</h1>
                    </div>
                    <ButtonNav ruta={'/contact'} texto={'Contacto/soporte'} className="btn-soporte" />
                </div>

                <div className="indicadores-container">
                    <div className="banner-estado banner-verde">
                        <label>Pedidos entregados hoy</label>
                        <h2>24</h2>
                    </div>
                    <div className="banner-estado banner-naranja">
                        <label>Pedidos pendientes</label>
                        <h2>14</h2>
                    </div>
                    <div className="banner-estado banner-rojo">
                        <label>Pedidos rechazados</label>
                        <h2>2</h2>
                    </div>
                </div>

                <div className="btn-registrar-container">
                    <ButtonNav ruta={'/checklist'} texto={'Registrar'} className="btn-registrar" />
                </div>

                <div className="columna-detalles">
                    <table className="tabla-limpia">
                        <thead>
                            <tr>
                                <th>Boleta(id)</th>
                                <th>Producto Principal</th>
                                <th>Cantidad</th>
                                <th>Cliente</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map((pedido, index) => {
                                let filaClase = "fila-verde";
                                if (pedido.estado === "pendiente") filaClase = "fila-amarilla";
                                if (pedido.estado === "rechazado") filaClase = "fila-roja";

                                return (
                                    <tr key={index} className={filaClase}>
                                        <td><strong>{pedido.id}</strong></td>
                                        <td>{pedido.producto}</td>
                                        <td>{pedido.cantidad}</td>
                                        <td>{pedido.cliente}</td>
                                        <td>
                                            <div className="celda-boton-detalle">
                                                <ButtonNav 
                                                    ruta={'/details'} 
                                                    texto={'DETALLES'} 
                                                    className={`btn-tabla-estado ${pedido.estado}`}
                                                />
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
