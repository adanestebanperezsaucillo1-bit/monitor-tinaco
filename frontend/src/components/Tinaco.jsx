// frontend/src/components/Tinaco.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Tinaco.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/tinaco';

const Tinaco = () => {
  const [datos, setDatos] = useState({
    nivel: 50,
    accion: 'Agua suficiente',
    color: '#2196f3',
    necesitaPipa: false,
    fuente: 'demo'
  });
  const [slider, setSlider] = useState(50);
  const [hora, setHora] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    consultar();
    const intervalo = setInterval(consultar, 2000);
    const reloj = setInterval(() => setHora(new Date().toLocaleTimeString()), 1000);
    return () => {
      clearInterval(intervalo);
      clearInterval(reloj);
    };
  }, []);

  const consultar = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setDatos(data);
      if (data.fuente === 'demo') setSlider(data.nivel);
    } catch {
      // Silencioso
    }
  };

  const cambiarNivel = async (valor) => {
    setSlider(valor);
    try {
      await axios.post(API_URL.replace('/tinaco', '/tinaco/nivel'), {
        nivel: valor,
        origen: 'demo'
      });
    } catch {
      // Silencioso
    }
  };

  // El agua siempre es azul (independiente del nivel)
  const colorAgua = '#2196f3';
  const aguaTieneBrillo = datos.nivel > 0;

  return (
    <div className="tinaco-container">
      <header className="tinaco-header">
        <h1>Monitor de Tinaco para la Nave 7 — MAF</h1>
        <p className="tinaco-subtitulo">Sistema de monitoreo de nivel de Agua</p>
      </header>

      <main className="tinaco-grid">
        {/* ===== TINACO REALISTA ===== */}
        <section className="tinaco-tarjeta">
          <h2>Nivel del Tinaco</h2>

          <div className="tinaco-escena">
            <div className="tanque">
              <div className="tanque-tapa">
                <div className="tanque-tapa-arriba" />
                <div className="tanque-tapa-cuerpo" />
              </div>

              <div className="tanque-cuerpo">
                <div className="tanque-reflejo" />

                <div
                  className="tanque-agua"
                  style={{
                    height: `${datos.nivel}%`,
                    background: aguaTieneBrillo
                      ? `linear-gradient(180deg, ${colorAgua}ee 0%, ${colorAgua} 50%, ${colorAgua}cc 100%)`
                      : 'transparent'
                  }}
                >
                  {aguaTieneBrillo && (
                    <div className="tanque-ondas-internas">
                      <span /><span /><span />
                    </div>
                  )}
                </div>

                <div className="tanque-marcas">
                  <span style={{ bottom: '20%' }}>20%</span>
                  <span style={{ bottom: '40%' }}>40%</span>
                  <span style={{ bottom: '60%' }}>60%</span>
                  <span style={{ bottom: '80%' }}>80%</span>
                  <span style={{ bottom: '100%' }}>100%</span>
                </div>

                <div className="tanque-porcentaje" style={{ color: datos.color }}>
                  {datos.nivel}%
                </div>
              </div>

              <div className="tanque-base" />
            </div>

            <div className="tanque-sombra" />
          </div>

          {/* Hora dentro de la sección del tanque */}
          <div className="tinaco-hora">
            🕐 {hora}
          </div>

          {/* Solo alerta cuando es bajo o crítico */}
          {datos.necesitaPipa && (
            <div
              className="tinaco-alerta-pipa"
              style={{ backgroundColor: datos.nivel <= 20 ? '#dc3545' : '#ff9800' }}
            >
              🚛 {datos.nivel <= 20 ? '¡Llama a la pipa de inmediato!' : 'Programa la pipa esta semana'}
            </div>
          )}
        </section>

        {/* ===== SIMULADOR (compacto) ===== */}
        <section className="tinaco-tarjeta tinaco-tarjeta-simulador">
          <h2>🎮 Simulador del Sensor</h2>

          {datos.fuente === 'esp32' ? (
            <div className="tinaco-sensor-real">
              📡 Sensor real conectado
              <small>El slider está deshabilitado porque el ESP32 envía datos.</small>
            </div>
          ) : (
            <>
              <p className="tinaco-slider-label">
                
              </p>
              <input
                type="range"
                min="0"
                max="100"
                value={slider}
                onChange={(e) => cambiarNivel(Number(e.target.value))}
                className="tinaco-slider"
              />
              <div className="tinaco-slider-valores">
                <span>0%</span>
                <strong style={{ color: datos.color }}>{slider}%</strong>
                <span>100%</span>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Tinaco;