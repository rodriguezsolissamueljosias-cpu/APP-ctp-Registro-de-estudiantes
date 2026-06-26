import React, { useState, useEffect } from 'react';
import { studentAPI, attendanceAPI } from '../utils/api';
import './JustificationDashboard.css';

export default function JustificationDashboard({ section }) {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const teacherId = 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sRes, aRes] = await Promise.all([
          studentAPI.getByTeacher(teacherId),
          attendanceAPI.getAll()
        ]);
        
        const filtered = sRes.data.filter(s => s.section === section);
        setStudents(filtered);
        setRecords(aRes.data);
      } catch (err) {
        console.error('Error al obtener datos:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (section) {
      fetchData();
    }
  }, [section]);

  const updateStatus = async (recordId, newStatus) => {
    try {
      const res = await attendanceAPI.update(recordId, { status: newStatus });
      setRecords(records.map(r => r.id === recordId ? res.data : r));
      setMessage('✓ Estado actualizado correctamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('✕ Error al actualizar');
      setTimeout(() => setMessage(''), 3000);
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    let className = 'status-item';
    if (status === 'Justificado') className += ' justified';
    else if (status === 'Presente') className += ' present';
    else if (status === 'Tarde') className += ' late';
    else if (status === 'Ausente') className += ' absent';
    return className;
  };

  const justifiedCount = records.filter(r => r.status === 'Justificado').length;

  return (
    <div className="justification-dashboard">
      <div className="container">
        <div className="justification-header">
          <div>
            <h2>📋 Justificaciones</h2>
            <p className="header-subtitle">Gestiona las justificaciones de ausencias - Sección {section}</p>
          </div>
        </div>

        <div className="justification-stats">
          <div className="stat-card">
            <span className="stat-icon">📋</span>
            <span className="stat-label">Justificadas</span>
            <span className="stat-value">{justifiedCount}</span>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <p>⏳ Cargando datos...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <p>🎓 No hay estudiantes en esta sección</p>
          </div>
        ) : (
          <div className="justification-list-wrapper">
            <div className="list-info">
              {students.length} estudiantes en la sección
            </div>

            {message && <div className="message">{message}</div>}

            <div className="justification-list">
              {students.map((s, idx) => {
                const record = records.find(r => r.studentId === s.id);
                return (
                  <div key={s.id} className="justification-item">
                    <div className="student-info">
                      <span className="student-number">{idx + 1}</span>
                      <div className="student-details">
                        <span className="student-name">{s.name}</span>
                        {record && (
                          <span className="record-date">
                            {new Date(record.date).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="status-selector">
                      {record ? (
                        <>
                          <span className={`status-badge ${getStatusBadge(record.status).replace('status-item ', '')}`}>
                            {record.status}
                          </span>
                          <select
                            value={record.status}
                            onChange={(e) => updateStatus(record.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="Presente">✓ Presente</option>
                            <option value="Tarde">⏰ Tarde</option>
                            <option value="Ausente">✕ Ausente</option>
                            <option value="Justificado">📋 Justificado</option>
                          </select>
                        </>
                      ) : (
                        <span className="no-record">
                          Sin registro
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
