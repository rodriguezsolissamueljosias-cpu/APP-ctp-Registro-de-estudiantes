import React, { useState, useEffect } from 'react';
import { gradeAPI, sectionAPI } from '../utils/api';
import './Settings.css';

function Settings({ onLogoUpload, currentLogo }) {
  const [logo, setLogo] = useState(currentLogo);
  const [message, setMessage] = useState('');

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        setMessage('Por favor selecciona una imagen válida');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setLogo(base64);
        localStorage.setItem('schoolLogo', base64);
        onLogoUpload(base64);
        setMessage('✓ Logo actualizado correctamente');
        setTimeout(() => setMessage(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    localStorage.removeItem('schoolLogo');
    onLogoUpload(null);
    setMessage('✓ Logo eliminado');
    setTimeout(() => setMessage(''), 3000);
  };

  // Grades & sections management
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [newGrade, setNewGrade] = useState('');
  const [newSection, setNewSection] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [gRes, sRes] = await Promise.all([gradeAPI.getAll(), sectionAPI.getAll()]);
        setGrades(gRes.data || []);
        setSections(sRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const addGrade = async () => {
    if (!newGrade) return;
    try {
      const res = await gradeAPI.create({ name: newGrade });
      setGrades(prev => [...prev, res.data]);
      setNewGrade('');
    } catch (err) {
      console.error(err);
      alert('Error al crear grado');
    }
  };

  const deleteGrade = async (id) => {
    if (!window.confirm('Eliminar grado?')) return;
    try {
      await gradeAPI.delete(id);
      setGrades(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar grado');
    }
  };

  const addSection = async () => {
    const trimmedName = newSection.trim();
    if (!trimmedName) return;
    if (sections.some(s => s.name.toLowerCase() === trimmedName.toLowerCase())) {
      return alert('Ya existe esa sección');
    }
    try {
      const res = await sectionAPI.create({ name: trimmedName });
      setSections(prev => [...prev, res.data]);
      setNewSection('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.response?.data?.message || err.message || 'Error al crear sección');
    }
  };

  const deleteSection = async (id) => {
    if (!window.confirm('Eliminar sección?')) return;
    try {
      await sectionAPI.delete(id);
      setSections(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar sección');
    }
  };

  return (
    <div className="settings-container">
      <h2>⚙️ Configuración</h2>

      <div className="settings-section">
        <h3>Logo del Colegio</h3>
        <p className="settings-description">
          Sube el escudo o logo del colegio que aparecerá en la esquina superior derecha
        </p>

        <div className="logo-upload-area">
          <input
            type="file"
            id="logo-input"
            accept="image/*"
            onChange={handleLogoUpload}
            className="file-input"
          />
          <label htmlFor="logo-input" className="upload-label">
            <span className="upload-icon">📤</span>
            <span className="upload-text">Haz clic para seleccionar imagen</span>
            <span className="upload-subtext">PNG, JPG, GIF - Máx 5MB</span>
          </label>
        </div>

        {logo && (
          <div className="logo-preview">
            <img src={logo} alt="Logo Colegio" className="preview-img" />
            <button className="remove-btn" onClick={removeLogo}>
              ✕ Eliminar Logo
            </button>
          </div>
        )}

        {message && <div className="settings-message">{message}</div>}
      </div>

      <div className="settings-section">
        <h3>Información de la Aplicación</h3>
        <p><strong>Versión:</strong> 1.0.0</p>
        <p><strong>Desarrollado para:</strong> CTP Platanar</p>
        <p><strong>Sistema de:</strong> Asistencia y Control de Estudiantes</p>
      </div>

      <div className="settings-section">
        <h3>Consejos de Uso</h3>
        <ul className="tips-list">
          <li>Usa el Dashboard de Estudiantes para gestionar tu lista</li>
          <li>Marca asistencia desde la sección de Asistencia</li>
          <li>El Registrador permite agregar nuevos estudiantes</li>
          <li>Carga un logo de tu colegio para personalizarlo</li>
        </ul>
      </div>

      <div className="settings-section">
        <h3>Grados y Secciones</h3>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <h4>Grados</h4>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={newGrade} onChange={e => setNewGrade(e.target.value)} placeholder="Nuevo grado (ej: 9)" />
              <button onClick={addGrade}>➕</button>
            </div>
            <ul>
              {grades.map(g => (
                <li key={g.id}>{g.name} <button onClick={() => deleteGrade(g.id)}>✕</button></li>
              ))}
            </ul>
          </div>

          <div style={{ flex: 1 }}>
            <h4>Secciones</h4>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={newSection} onChange={e => setNewSection(e.target.value)} placeholder="Nueva sección (ej: 9-1)" />
              <button onClick={addSection}>➕</button>
            </div>
            <ul>
              {sections.map(s => (
                <li key={s.id}>{s.name} <button onClick={() => deleteSection(s.id)}>✕</button></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
