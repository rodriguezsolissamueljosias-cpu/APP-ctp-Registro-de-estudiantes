const express = require('express');
const router = express.Router();
const Section = require('../models/Section');

// Obtener todas las secciones
router.get('/', async (req, res) => {
  try {
    const sections = await Section.findAll({ order: [['name', 'ASC']] });
    res.json(sections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las secciones' });
  }
});

// Crear sección
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'El nombre de la sección es obligatorio' });
    const section = await Section.create({ name });
    res.status(201).json(section);
  } catch (err) {
    console.error(err);
    // Manejar errores de validación / unique
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Ya existe una sección con ese nombre' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Error al crear la sección' });
  }
});

// Eliminar sección por id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const found = await Section.findByPk(id);
    if (!found) return res.status(404).json({ error: 'Sección no encontrada' });
    await found.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la sección' });
  }
});

module.exports = router;
