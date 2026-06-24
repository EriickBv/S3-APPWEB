import { useState } from 'react';
import Mensaje from '../Mensaje';

const Paso3Respaldo = ({ datos, setDatos, volver }) => {
  const [esTercero, setEsTercero] = useState(datos.esTercero);
  const [codigoEscaneado, setCodigoEscaneado] = useState(datos.codigoEscaneado || '');
  const [fotoCarnet, setFotoCarnet] = useState(datos.fotoCarnet);
  
  const [mensajeConfig, setMensajeConfig] = useState(null);
  const [procesoExitoso, setProcesoExitoso] = useState(false);

  const handleFinalizarProceso = (e) => {
    e.preventDefault();
    if (!codigoEscaneado.trim()) {
      setMensajeConfig({ tipo: 'error', texto: 'Debe escanear el QR o ingresar el código de la boleta.' });
      return;
    }
    if (esTercero && !fotoCarnet) {
      setMensajeConfig({ tipo: 'error', texto: 'Para retiros por terceros, es obligatorio adjuntar la foto del carnet.' });
      return;
    }
    setDatos(prev => ({
      ...prev,
      codigoEscaneado: codigoEscaneado,
      esTercero: esTercero,
      fotoCarnet: fotoCarnet
    }));
    setMensajeConfig({ 
      tipo: 'exito', 
      texto: 'Identidad verificada con éxito', 
      subtexto: esTercero ? 'Código escaneado y carnet registrado. Retiro autorizado.' : 'Código escaneado validado. Retiro autorizado para titular.' 
    });
    setProcesoExitoso(true);
  };

  const cerrarPopupError = () => setMensajeConfig(null);

  return (
    <article className="paso-container paso-respaldo">
      <h2>Ingresar Retiro</h2>
      <h3>Respaldo</h3>

      <form onSubmit={handleFinalizarProceso} className="form-respaldo">
        
        <div className="form-group">
          <label htmlFor="tipoRetirante">¿Quién realiza el retiro?</label>
          <select 
            id="tipoRetirante" 
            value={esTercero ? 'tercero' : 'titular'}
            onChange={(e) => {
              setEsTercero(e.target.value === 'tercero');
              setMensajeConfig(null);
            }}
          >
            <option value="titular">Titular de la compra</option>
            <option value="tercero">Un Tercero autorizado</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="codigoBoleta">Escanear QR o código boleta</label>
          <input 
            type="text" 
            id="codigoBoleta" 
            value={codigoEscaneado} 
            onChange={(e) => setCodigoEscaneado(e.target.value)} 
            placeholder="Ingrese el código escaneado..." 
          />
        </div>

        {esTercero && (
          <div className="form-group campo-dinamico-foto">
            <label htmlFor="fotoId">Adicionalmente: Foto de carnet del que retira (en caso de un tercero)</label>
            <input 
              type="file" 
              id="fotoId" 
              accept="image/*"
              onChange={(e) => setFotoCarnet(e.target.files[0])}
            />
          </div>
        )}

        <div className="navigation-buttons">
          <button type="button" onClick={volver} className="btn-nav">
            Atrás
          </button>
          <button type="submit" className="btn-finalizar">
            Finalizar Retiro
          </button>
        </div>
      </form>

      {mensajeConfig && (
        <div className="overlay-modal">
          <div className={`popup-validacion-modal ${mensajeConfig.tipo}`}>
            
            <h3>{mensajeConfig.texto}</h3>
            {mensajeConfig.subtexto && <p>{mensajeConfig.subtexto}</p>}
            
            <div className="popup-botones">
              {procesoExitoso ? (
                <button 
                  type="button" 
                  onClick={() => window.location.href = '/details'} 
                  className="btn-nav"
                >
                  Confirmar y ver detalles
                </button>
              ) : (
                <button type="button" onClick={cerrarPopupError} className="btn-reintentar">
                  Entendido
                </button>
              )}
            </div>
            
          </div>
        </div>
      )}
    </article>
  );
};

export default Paso3Respaldo;