import { useState } from 'react';

const Paso2Boleta = ({ datos, setDatos, alCompletar, volver }) => {
  const [boleta, setBoleta] = useState(datos.boletaId);

  const [productos, setProductos] = useState([
    { id: 1, codigo: 'SKU-100', nombre: 'Monitor 24"', categoria: 'Electrónica', checked: false, problema: null },
    { id: 2, codigo: 'SKU-101', nombre: 'Teclado Mecánico', categoria: 'Accesorios', checked: false, problema: null },
    { id: 3, codigo: 'SKU-102', nombre: 'Mouse Inalámbrico', categoria: 'Accesorios', checked: false, problema: null },
    { id: 4, codigo: 'SKU-103', nombre: 'Cable HDMI 2m', categoria: 'Cables', checked: false, problema: null }
  ]);

  const [popupVisible, setPopupVisible] = useState(false);
  const [productoConProblema, setProductoConProblema] = useState(null);

  const handleCheckboxChange = (id) => {
    setProductos(productos.map(p => {
      if (p.id === id) {
        return { ...p, checked: !p.checked, problema: !p.checked ? null : p.problema };
      }
      return p;
    }));
  };

  const abrirProblema = (producto) => {
    setProductoConProblema(producto);
    setPopupVisible(true);
  };

  const cerrarProblema = () => {
    setPopupVisible(false);
    setProductoConProblema(null);
  };

  const handleGuardarProblema = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const problemasSeleccionados = formData.getAll('problema').join(', ');

    if (problemasSeleccionados !== '') {
      setProductos(productos.map(p => 
        p.id === productoConProblema.id ? { ...p, problema: problemasSeleccionados, checked: false } : p
      ));
    }
    cerrarProblema();
  };

  const todoListo = productos.every(p => p.checked || p.problema !== null) && boleta.trim() !== '';

  const handleContinuar = () => {
    setDatos(prev => ({ ...prev, boletaId: boleta, productosEntregados: productos }));
    alCompletar();
  };

  return (
    <article className="paso-container paso-boleta">
      <h2>Ingresar Retiro</h2>

      <div className="form-group">
        <label htmlFor="idBoleta">Boleta</label>
        <input 
          type="text" 
          id="idBoleta" 
          value={boleta} 
          onChange={(e) => setBoleta(e.target.value)} 
          placeholder="Id de la Boleta" 
        />
      </div>

      <div className="tabla-container">
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Entrega / Problema</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => {
              let claseFila = 'row-pendiente';
              if (prod.checked) claseFila = 'row-entregado';
              if (prod.problema) claseFila = 'row-problema';

              return (
                <tr key={prod.id} className={claseFila}>
                  <td>{prod.codigo}</td>
                  <td>{prod.nombre}</td>
                  <td>{prod.categoria}</td>
                  <td className="acciones-celda">
                    <input 
                      type="checkbox" 
                      checked={prod.checked} 
                      onChange={() => handleCheckboxChange(prod.id)} 
                      aria-label="Marcar entrega"
                    />
                    <button 
                      type="button" 
                      className="btn-alerta-problema" 
                      onClick={() => abrirProblema(prod)}
                      title="Reportar problema"
                    >
                      !
                    </button>
                    {prod.problema && <span className="etiqueta-problema">{prod.problema}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="navigation-buttons">
        <button type="button" onClick={volver} className="btn-nav">Atrás</button>
        <button 
          type="button" 
          onClick={handleContinuar} 
          disabled={!todoListo} 
          className="btn-continuar"
        >
          Continuar
        </button>
      </div>

      {popupVisible && (
        <div className="overlay-modal">
          <aside className="popup-problemas-modal">
            <h3>Pop up (problemas)</h3>
            <p className="subtitulo-modal">{productoConProblema?.nombre}</p>
            
            <form className="popup-options-form" onSubmit={handleGuardarProblema}>
              <label><input type="checkbox" name="problema" value="Sin stock" /> Sin stock</label>
              <label><input type="checkbox" name="problema" value="Dañado" /> Producto dañado</label>
              <label><input type="checkbox" name="problema" value="Código barras" /> Problema con código</label>
              <label><input type="checkbox" name="problema" value="Otros" /> Otros...</label>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button type="button" onClick={cerrarProblema} className="btn-reintentar" style={{width: '100%'}}>
                  Cancelar
                </button>
                <button type="submit" className="btn-nav" style={{width: '100%'}}>
                  Aplicar
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </article>
  );
};

export default Paso2Boleta;