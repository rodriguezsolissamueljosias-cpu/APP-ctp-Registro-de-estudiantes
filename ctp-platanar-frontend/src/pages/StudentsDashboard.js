import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI, sectionAPI } from '../utils/api';
import './StudentsDashboard.css';

export default function StudentsDashboard({ teacher, setSection, section }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [sectionError, setSectionError] = useState('');
  const navigate = useNavigate();

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetch = async () => {
      if (!teacher) return;
      setLoading(true);
      try {
        const res = await studentAPI.getByTeacher(teacher.teacherId);
        setStudents(res.data.filter(s => !section || s.section === section));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [teacher, section]);

  useEffect(() => {
    const fetchSections = async () => {
      setSectionsLoading(true);
      try {
        const res = await sectionAPI.getAll();
        setSections(res.data || []);
        // if current section not set or missing, pick first
        if ((!section || !res.data.find(s => s.name === section)) && res.data && res.data.length > 0) {
          setSection(res.data[0].name);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSectionsLoading(false);
      }
    };
    fetchSections();
  }, [setSection, section]);

  const handleDelete = async (studentId) => {
    try {
      await studentAPI.delete(studentId);
      setStudents(prev => prev.filter(s => s.id !== studentId));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar estudiante');
    }
  };


  const createSection = async () => {
    const name = newSectionName.trim();
    if (!name) {
      setSectionError('Ingresa un nombre de sección válido');
      return;
    }
    if (sections.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      setSectionError('Esa sección ya existe');
      return;
    }
    try {
      await sectionAPI.create({ name });
      const res = await sectionAPI.getAll();
      setSections(res.data || []);
      setSection(name);
      setNewSectionName('');
      setSectionError('');
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Error al crear la sección';
      setSectionError(message);
      alert(message);
    }
  };

  const deleteSection = async () => {
    if (!section) return alert('No hay sección seleccionada');
    const found = sections.find(s => s.name === section);
    if (!found) return alert('Sección no encontrada en la lista');
    if (!window.confirm(`Eliminar la sección "${section}"? Esto no eliminará estudiantes automáticamente.`)) return;
    try {
      await sectionAPI.delete(found.id);
      const res = await sectionAPI.getAll();
      setSections(res.data || []);
      // set to first available or empty
      if (res.data && res.data.length > 0) setSection(res.data[0].name);
      else setSection('');
    } catch (err) {
      console.error(err);
      alert('Error al eliminar la sección');
    }
  };

  return (
    <div className="students-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h2>📚 Panel de Estudiantes</h2>
            <p className="header-subtitle">Profesor: {teacher ? `${teacher.name} | ${teacher.subject}` : 'No identificado - por favor inicia sesión'}</p>
          </div>
        </div>

        <div className="section-selector">
          <label>Selecciona Sección:</label>
          <select value={section} onChange={(e) => setSection(e.target.value)} className="section-select">
            {sectionsLoading ? (
              <option>Loading...</option>
            ) : (
              sections.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))
            )}
          </select>
          <div className="section-actions">
            <div className="section-create">
              <input
                className="section-create-input"
                placeholder="Nueva sección (ej: 9-1)"
                value={newSectionName}
                onChange={(e) => { setNewSectionName(e.target.value); setSectionError(''); }}
              />
              <button className="btn-small" onClick={createSection}>➕ Crear</button>
            </div>
            <button className="btn-small btn-danger" onClick={deleteSection}>🗑️ Eliminar</button>
          </div>
          {sectionError && <p className="section-error">{sectionError}</p>}
          <div className="search-field">
            <label htmlFor="student-search">Buscar estudiante:</label>
            <input
              id="student-search"
              className="search-input"
              type="text"
              placeholder="Deiby Samir"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={() => navigate('/registrar')}
          >
            📝 Registrador de Estudiantes
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/attendance')}
          >
            ✓ Pasar Asistencia
          </button>
          <button 
            className="btn-success"
            onClick={() => navigate('/justifications')}
          >
            📋 Justificaciones
          </button>
        </div>

        <div className="students-info">
          <h3>📊 Total de Estudiantes: <span className="count">{students.length}</span></h3>
          {searchTerm && (
            <p className="search-info">Filtrando por: "{searchTerm}"</p>
          )}
        </div>

        {loading ? (
          <div className="loading">
            <p>⏳ Cargando estudiantes...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <p>🎓 No hay estudiantes registrados en esta sección</p>
            <button className="btn-primary" onClick={() => navigate('/registrar')}>
              Agregar Primer Estudiante
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <p>🔎 No se encontraron estudiantes con ese nombre.</p>
            <button className="btn-primary" onClick={() => setSearchTerm('')}>
              Mostrar todos
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>👤 Nombre</th>
                  <th>📖 Grado</th>
                  <th>🏢 Sección</th>
                  <th>📧 Correo Padres</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, idx) => (
                  <tr key={s.id} className={idx % 2 === 0 ? 'even' : 'odd'}>
                    <td className="student-name">{s.name}</td>
                    <td>{s.grade}</td>
                    <td>
                      <span className="section-badge">{s.section}</span>
                    </td>
                    <td className="email">{s.parentEmail || 'N/A'}</td>
                    <td>
                      <button style={{ background: '#f5576c', color: '#fff' }} onClick={() => handleDelete(s.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
