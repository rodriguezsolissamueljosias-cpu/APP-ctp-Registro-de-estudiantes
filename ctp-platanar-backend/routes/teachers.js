const express = require('express');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');

const router = express.Router();

// Registrar profesor
router.post('/', async (req, res) => {
  try {
    const { teacherId, name, phone, email, password, subject } = req.body;

    const existingTeacher = await Teacher.findOne({ where: { email } });
    if (existingTeacher) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      teacherId,
      name,
      phone,
      email,
      password: hashedPassword,
      subject
    });

    res.status(201).json({
      teacherId: teacher.teacherId,
      name: teacher.name,
      subject: teacher.subject,
      email: teacher.email
    });
  } catch (err) {
    res.status(400).json({ message: 'Error al registrar profesor', error: err.message });
  }
});

// Login profesor
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ where: { email } });
    if (!teacher) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.json({
      teacherId: teacher.teacherId,
      name: teacher.name,
      subject: teacher.subject,
      email: teacher.email
    });
  } catch (err) {
    res.status(400).json({ message: 'Error al iniciar sesión', error: err.message });
  }
});

// Borrar todos los profesores
router.delete('/', async (req, res) => {
  try {
    await Teacher.destroy({ where: {} });
    res.json({ message: 'Todos los profesores eliminados' });
  } catch (err) {
    res.status(500).json({ message: 'Error al borrar profesores', error: err.message });
  }
});

module.exports = router;
