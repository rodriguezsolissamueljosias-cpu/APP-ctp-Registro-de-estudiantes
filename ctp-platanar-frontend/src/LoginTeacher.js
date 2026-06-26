import React, { useState } from 'react';
import axios from 'axios';

function LoginTeacher({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/teachers/login', { email, password });
      onLogin(res.data);
    } catch (err) {
      alert("Error al iniciar sesión");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar Sesión Profesor</h2>
      <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Ingresar</button>
      <p>¿No tienes cuenta? <button type="button" onClick={onSwitch}>Regístrate aquí</button></p>
    </form>
  );
}

export default LoginTeacher;
