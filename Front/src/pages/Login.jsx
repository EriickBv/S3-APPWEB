import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.scss'; 

function Login() {
  const navigate = useNavigate();
  
  const [credentials, setCredentials] = useState({
    usuario: '',
    contrasena: ''
  });

  const [errorMensaje, setErrorMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    if (errorMensaje) setErrorMensaje('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (credentials.usuario === '12345678-9' && credentials.contrasena === '1234') {
      setErrorMensaje(''); 
      console.log("Acceso concedido. Redirigiendo...");
      navigate('/dashboard'); 
    } else {
      setErrorMensaje('RUT o contraseña incorrectos. Intente nuevamente.');
    }
  };

  return (
    <section className="login-container-full">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        
        <p className="aviso-solemne-texto">
          * El usuario y contraseña están limitados a uno solo debido a que es un trabajo solemne.
        </p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="inputs-box">
            <div className="input-group">
              <input 
                type="text" 
                name="usuario" 
                placeholder="Usuario/rut" 
                value={credentials.usuario}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input 
                type="password" 
                name="contrasena" 
                placeholder="Contraseña" 
                value={credentials.contrasena}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {errorMensaje && (
            <div className="login-error-message">
              <span>⚠ {errorMensaje}</span>
            </div>
          )}

          <button type="submit" className="btn-access">
            Acceder
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
