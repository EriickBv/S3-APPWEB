const API_BASE = '/api';

const getToken = () => localStorage.getItem('access_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
};

export const loginApi = async (rut, password) => {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rut, password }),
  });
  return handleResponse(res);
};

export const logoutApi = async () => {
  await fetch(`${API_BASE}/auth/logout/`, {
    method: 'POST',
    headers: authHeaders(),
  });
  localStorage.clear();
};

export const getDashboard = async () => {
  const res = await fetch(`${API_BASE}/dashboard/`, { headers: authHeaders() });
  return handleResponse(res);
};

export const buscarBoletaPorRut = async (rut) => {
  const res = await fetch(`${API_BASE}/boleta/?rut=${encodeURIComponent(rut)}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
};

export const procesarRetiro = async (datos) => {
  const form = new FormData();
  form.append('boleta_id', datos.boleta_id);
  form.append('es_tercero', datos.es_tercero);
  form.append('productos', JSON.stringify(datos.productos));
  if (datos.foto_respaldo) form.append('foto_respaldo', datos.foto_respaldo);

  const res = await fetch(`${API_BASE}/retiro/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  return handleResponse(res);
};

export const getDetalleBoleta = async (boletaId) => {
  const res = await fetch(`${API_BASE}/detalle-boleta/${boletaId}/`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
};

export const crearIncidencia = async (datos) => {
  const res = await fetch(`${API_BASE}/incidencia/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(datos),
  });
  return handleResponse(res);
};

export const getIncidencias = async () => {
  const res = await fetch(`${API_BASE}/incidencias/`, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
};
