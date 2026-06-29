import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../api/api';
import '../styles/Login.scss';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ usuario: '', contrasena: '' });
  const [errorMensaje, setErrorMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    if (errorMensaje) setErrorMensaje('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const data = await loginApi(credentials.usuario, credentials.contrasena);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      navigate('/dashboard');
    } catch (err) {
      setErrorMensaje(err.message || 'RUT o contraseña incorrectos.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="login-container-full">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="inputs-box">
            <div className="input-group">
              <input
                type="text"
                name="usuario"
                placeholder="RUT (ej: 12345678-9)"
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
          <button type="submit" className="btn-access" disabled={cargando}>
            {cargando ? 'Verificando...' : 'Acceder'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
