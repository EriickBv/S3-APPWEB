import React from 'react';

const Mensaje = ({ tipo, texto }) => {
  if (!texto) return null; 
  return (
    <div className={`alerta alerta-${tipo}`} role="alert">
      <p>{texto}</p>
    </div>
  );
};
export default Mensaje;
