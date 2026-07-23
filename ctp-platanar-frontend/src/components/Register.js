// src/components/Register.js
import React, { useState } from 'react';
import { teacherAPI } from '../utils/api';

function Register({ setTeacher }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    section: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await teacherAPI.register(formData);
      const teacher = res.data;
      localStorage.setItem('teacher', JSON.stringify(teacher));
      setTeacher(teacher);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar profesor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="firstName" 
        placeholder="Nombre" 
        value={formData.firstName} 
        onChange={handleChange} 
        required 
      />
      <input 
        name="lastName" 
        placeholder="Apellido" 
        value={formData.lastName} 
        onChange={handleChange} 
        required 
      />
      <input 
        name="section" 
        placeholder="Sección" 
        value={formData.section} 
        onChange={handleChange} 
      />
      <input 
        name="email" 
        type="email" 
        placeholder="Correo" 
        value={formData.email} 
        onChange={handleChange} 
        required 
      />
      <input 
        name="phone" 
        placeholder="Teléfono (opcional)" 
        value={formData.phone} 
        onChange={handleChange} 
      />
      <input 
        name="password" 
        type="password" 
        placeholder="Contraseña" 
        value={formData.password} 
        onChange={handleChange} 
        required 
      />
      <button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrar Profesor'}</button>
    </form>
  );
}

export default Register;
