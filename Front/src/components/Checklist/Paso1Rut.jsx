import { useState } from 'react';
import ButtonNav from '../ButtonNav';

const Paso1Rut = ({ datos, setDatos, alCompletar }) => {
  const [rutInput, setRutInput] = useState(datos.rut);
  const [mensajeConfig, setMensajeConfig] = useState(null);
  const [esValido, setEsValido] = useState(false);

  const handleValidar = (e) => {
    e.preventDefault();

    if (!rutInput.trim()) {
      setMensajeConfig({ tipo: 'error', texto: 'El rut ingresado no registra retiros pendientes' });
      setEsValido(false);
      return;
    }

    setDatos((prev) => ({
      ...prev,
      rut: rutInput,
      clienteNombre: 'Carlos Mendoza'
    }));
    setMensajeConfig({ tipo: 'exito', texto: 'Cliente válido', subtexto: 'Carlos Mendoza' });
    setEsValido(true);
  };

  const cerrarPopup = () => setMensajeConfig(null);

  return (
    <article className="paso-container">
      <h2>Ingresar Retiro</h2>
      
      <form onSubmit={handleValidar} className="form-rut">
        <div className="form-group">
          <label htmlFor="rutCliente">Rut</label>
          <input 
            type="text" 
            id="rutCliente" 
            value={rutInput} 
            onChange={(e) => setRutInput(e.target.value)} 
            placeholder="Rut de Cliente"
          />
        </div>
        
        <div className="botones-accion">
          <ButtonNav ruta={'/dashboard'} texto={'Cancelar'} />
          <button type="submit" className="btn-validar">Validar</button>
        </div>
      </form>

      {mensajeConfig && (
        <div className="overlay-modal">
          <div className={`popup-validacion-modal ${mensajeConfig.tipo}`}>
            
            <h3>{mensajeConfig.texto}</h3>
            {mensajeConfig.subtexto && <p>{mensajeConfig.subtexto}</p>}
            
            <div className="popup-botones">
              {esValido ? (
                <button type="button" onClick={alCompletar} className="btn-nav">
                  Continuar al listado
                </button>
              ) : (
                <button type="button" onClick={cerrarPopup} className="btn-reintentar">
                  Reintentar
                </button>
              )}
            </div>
            
          </div>
        </div>
      )}
    </article>
  );
};

export default Paso1Rut;