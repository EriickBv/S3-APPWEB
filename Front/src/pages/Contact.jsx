import { useState, useEffect } from 'react';
import Mensaje from '../components/Mensaje';
import ButtonNav from '../components/ButtonNav';
import { crearIncidencia, getIncidencias } from '../api/api';
import '../styles/Contact.scss';

const Contact = () => {
  useEffect(() => {
    document.title = 's2 | Contacto';
    cargarHistorial();
  }, []);

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const [formData, setFormData] = useState({
    operador: usuario.nombre || 'Operador',
    sede: usuario.sede || 'Sede Central',
    fechaHora: new Date().toLocaleString(),
    categoria: '',
    descripcion: '',
    urgencia: 'Baja',
  });

  const [mensajeData, setMensajeData] = useState({ tipo: '', texto: '' });
  const [historial, setHistorial] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const cargarHistorial = async () => {
    const data = await getIncidencias();
    setHistorial(data);
  };

  const urgenciaMap = { Baja: 'BAJA', Media: 'MEDIA', Alta: 'ALTA' };

  const categoriaLabel = {
    hardware: 'Falla Física o Daño de Equipo',
    software: 'Problema de Software o Configuración',
    solicitud: 'Solicitud de Nuevo Equipo/Accesorio',
    extravio: 'Reporte de Robo o Extravío',
    plataforma: 'Error en la Plataforma',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoria || !formData.descripcion.trim()) {
      setMensajeData({ tipo: 'error', texto: 'Por favor, selecciona una categoría y describe el problema.' });
      return;
    }

    setEnviando(true);
    try {
      const descripcionCompleta = `[${categoriaLabel[formData.categoria] || formData.categoria}] ${formData.descripcion}`;

      await crearIncidencia({
        id_sede: formData.sede,
        descripcion: descripcionCompleta,
        nivel_urgencia: urgenciaMap[formData.urgencia] || 'BAJA',
      });

      setMensajeData({ tipo: 'exito', texto: 'Reporte enviado correctamente. El equipo lo revisará pronto.' });
      setFormData((prev) => ({ ...prev, categoria: '', descripcion: '', urgencia: 'Baja' }));
      cargarHistorial();
    } catch (err) {
      setMensajeData({ tipo: 'error', texto: err.message || 'Error al enviar el reporte.' });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="pagina-contacto">
      <div className="cabecera-contacto">
        <ButtonNav ruta="/dashboard" texto="← Volver al Dashboard" claseExtra="btn-volver" />
      </div>

      <section className="soporte-urgente">
        <h2>Urgente (hay un cliente esperando)</h2>
        <div className="botones-urgencia">
          <button type="button" className="btn-llamar">Llamar Soporte</button>
          <button type="button" className="btn-chat">Chat Soporte</button>
        </div>
      </section>

      <section className="formulario-soporte">
        <Mensaje tipo={mensajeData.tipo} texto={mensajeData.texto} />

        <form onSubmit={handleSubmit} className="grid-formulario">
          <fieldset className="columna-datos">
            <legend>Datos del operador</legend>
            <div className="campo">
              <label htmlFor="operador">Operador</label>
              <input type="text" id="operador" name="operador" value={formData.operador} readOnly disabled />
            </div>
            <div className="campo">
              <label htmlFor="sede">Sede</label>
              <input type="text" id="sede" name="sede" value={formData.sede} readOnly disabled />
            </div>
            <div className="campo">
              <label htmlFor="fechaHora">Fecha y hora</label>
              <input type="text" id="fechaHora" name="fechaHora" value={formData.fechaHora} readOnly disabled />
            </div>
          </fieldset>

          <fieldset className="columna-detalles">
            <legend>Detalles del problema</legend>
            <div className="campo">
              <label htmlFor="categoria">Categoría del problema</label>
              <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange}>
                <option value="">Seleccione una categoría...</option>
                <option value="hardware">Falla Física o Daño de Equipo</option>
                <option value="software">Problema de Software o Configuración</option>
                <option value="solicitud">Solicitud de Nuevo Equipo/Accesorio</option>
                <option value="extravio">Reporte de Robo o Extravío</option>
                <option value="plataforma">Error en la Plataforma</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="descripcion">Descripción del problema</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="3"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describa el problema aquí..."
              />
            </div>
          </fieldset>

          <fieldset className="columna-urgencia">
            <legend>Nivel de urgencia</legend>
            <div className="opciones-urgencia">
              {['Baja', 'Media', 'Alta'].map((nivel) => (
                <label key={nivel} className={`radio-btn ${formData.urgencia === nivel ? 'activo' : ''}`}>
                  <input
                    type="radio"
                    name="urgencia"
                    value={nivel}
                    checked={formData.urgencia === nivel}
                    onChange={handleChange}
                  />
                  {nivel === 'Baja' ? 'Consulta (Baja)' : nivel === 'Media' ? 'Parcial (Media)' : 'Urgente (Alta)'}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="footer-formulario">
            <article className="historial-reportes">
              <h3>Historial reciente de la sede</h3>
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.length === 0 && (
                    <tr><td colSpan={3}>Sin reportes recientes.</td></tr>
                  )}
                  {historial.map((inc) => (
                    <tr key={inc.id}>
                      <td>{inc.fecha}</td>
                      <td>{inc.descripcion}</td>
                      <td>{inc.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            <button type="submit" className="btn-enviar" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar Reporte'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Contact;
