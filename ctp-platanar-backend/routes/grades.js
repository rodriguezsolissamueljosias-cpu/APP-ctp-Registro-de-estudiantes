const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');

// Obtener todas las grados
router.get('/', async (req, res) => {
  try {
    const grades = await Grade.findAll({ order: [['name', 'ASC']] });
    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los grados' });
  }
});

// Crear grado
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const grade = await Grade.create({ name });
    res.status(201).json(grade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el grado' });
  }
});

// Eliminar grado por id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const found = await Grade.findByPk(id);
    if (!found) return res.status(404).json({ error: 'Grado no encontrado' });
    await found.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el grado' });
  }
});

module.exports = router;
