// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// ESTADO DEL TINACO
// ==========================================
let nivel = 50;          // 0 a 100
let fuente = 'demo';     // 'demo' (slider) | 'esp32' (sensor real)

// ==========================================
// CALCULA ESTADO, ACCIÓN, COLOR Y EMOJI
// ==========================================
function obtenerInfoNivel(n) {
  if (n <= 20) return {
    estado: 'CRÍTICO',
    accion: 'Llamar a la pipa YA',
    color: '#dc3545',
    emoji: '🔴',
    necesitaPipa: true
  };
  if (n <= 40) return {
    estado: 'BAJO',
    accion: 'Programar pipa',
    color: '#ff9800',
    emoji: '🟠',
    necesitaPipa: true
  };
  if (n <= 70) return {
    estado: 'MEDIO',
    accion: 'Agua suficiente',
    color: '#2196f3',
    emoji: '🔵',
    necesitaPipa: false
  };
  if (n <= 90) return {
    estado: 'ALTO',
    accion: 'Puedes enviar agua a otra zona',
    color: '#28a745',
    emoji: '🟢',
    necesitaPipa: false
  };
  return {
    estado: 'LLENO',
    accion: 'Puedes enviar agua a otra zona',
    color: '#28a745',
    emoji: '🟢',
    necesitaPipa: false
  };
}

// ==========================================
// RUTAS
// ==========================================

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({ mensaje: '🚰 API Tinaco funcionando' });
});

// Obtener estado actual del tinaco
app.get('/api/tinaco', (req, res) => {
  const info = obtenerInfoNivel(nivel);
  res.json({
    nivel: Math.round(nivel),
    estado: info.estado,
    accion: info.accion,
    color: info.color,
    emoji: info.emoji,
    necesitaPipa: info.necesitaPipa,
    fuente
  });
});

// Actualizar nivel (lo usa el slider o el ESP32)
app.post('/api/tinaco/nivel', (req, res) => {
  const { nivel: nuevoNivel, origen } = req.body;

  if (typeof nuevoNivel === 'number' && nuevoNivel >= 0 && nuevoNivel <= 100) {
    nivel = nuevoNivel;
    fuente = origen === 'esp32' ? 'esp32' : 'demo';
    console.log(`📡 Nivel actualizado: ${nivel}% (${fuente})`);
    res.json({ ok: true, nivel, fuente });
  } else {
    res.status(400).json({ error: 'Nivel inválido. Debe ser 0-100' });
  }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});