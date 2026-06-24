import { useState, useEffect } from 'react';
import Paso1Rut from '../components/Checklist/Paso1Rut';
import Paso2Boleta from '../components/Checklist/Paso2Boleta';
import Paso3Respaldo from '../components/Checklist/Paso3Respaldo';
import '../styles/Checklist.scss';

const Checklist = () => {
  useEffect(() => {
      document.title = "s2 | Checklist";
    }, []);
  
  const [pasoActual, setPasoActual] = useState(1);
  const [datosRetiro, setDatosRetiro] = useState({
    rut: '',
    clienteNombre: '',
    boletaId: '',
    correoRespaldo: '',
    esTercero: false,
    fotoCarnet: null
  });
  const avanzarPaso = () => setPasoActual((prev) => prev + 1);
  const retrocederPaso = () => setPasoActual((prev) => prev - 1);

  return (
    <main className="checklist-page-wrapper">
      <header className="checklist-header">
        <h1>Control de Retiros</h1>
        <p>Paso {pasoActual} de 3</p>
      </header>

      <section className="checklist-content-card">
        {pasoActual === 1 && (
          <Paso1Rut 
            datos={datosRetiro} 
            setDatos={setDatosRetiro} 
            alCompletar={avanzarPaso} 
          />
        )}

        {pasoActual === 2 && (
          <Paso2Boleta 
            datos={datosRetiro} 
            setDatos={setDatosRetiro} 
            alCompletar={avanzarPaso} 
            volver={retrocederPaso}
          />
        )}

        {pasoActual === 3 && (
          <Paso3Respaldo 
            datos={datosRetiro} 
            setDatos={setDatosRetiro} 
            volver={retrocederPaso}
          />
        )}
      </section>
    </main>
  );
};

export default Checklist;