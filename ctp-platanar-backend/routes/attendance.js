// routes/attendance.js
const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Obtener todos los registros
router.get('/', async (req, res) => {
  try {
    const records = await Attendance.findAll();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar asistencia
router.post('/', async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar asistencia
router.put('/:id', async (req, res) => {
  try {
    const record = await Attendance.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Registro no encontrado' });
    await record.update(req.body);
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
