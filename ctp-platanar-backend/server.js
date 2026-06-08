// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');

// Importar modelos
const Teacher = require('./models/Teacher');
const Student = require('./models/Student');
const Attendance = require('./models/Attendance');
const Grade = require('./models/Grade');
const Section = require('./models/Section');

// Importar rutas
const teacherRoutes = require('./routes/teachers');
const studentRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
const gradeRoutes = require('./routes/grades');
const sectionRoutes = require('./routes/sections');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf && buf.toString();
  }
}));

// Rutas principales
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/sections', sectionRoutes);

// Manejador de errores de JSON malformado (body-parser / express.json)
app.use((err, req, res, next) => {
  if (err && err.status === 400 && err.type === 'entity.parse.failed') {
    console.error('❌ Malformed JSON received:', { method: req.method, path: req.path, rawBody: req.rawBody });
    return res.status(400).json({ error: 'Malformed JSON in request body' });
  }
  next(err);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Si estamos en producción, servir el build del frontend
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const buildPath = path.join(__dirname, '..', 'ctp-platanar-frontend', 'build');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Sincronizar base de datos y arrancar servidor
sequelize.sync({ alter: true }) // alter:true actualiza tablas si cambian los modelos
  .then(() => {
    console.log('📦 Tablas sincronizadas correctamente');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al sincronizar la base de datos:', err);
  });
