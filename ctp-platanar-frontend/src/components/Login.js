// src/components/Login.js
import React, { useState } from 'react';
import { teacherAPI } from '../utils/api';

function Login({ setTeacher }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await teacherAPI.login(email, password, accessCode);
      const teacher = res.data;
      localStorage.setItem('teacher', JSON.stringify(teacher));
      setTeacher(teacher);
    } catch (err) {
      alert('Error al iniciar sesión: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Iniciar Sesión Profesor</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Código de acceso (profesores)"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
        />
        <br />
        <button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Entrar'}</button>
      </form>
    </div>
  );
}

export default Login;
