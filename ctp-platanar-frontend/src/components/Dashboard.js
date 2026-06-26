// src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherProfile from './TeacherProfile';

function Dashboard({ teacher }) {
  const navigate = useNavigate();

  if (!teacher) {
    // Si no hay profesor logueado, redirigir al login
    navigate('/');
    return null;
  }

  return (
    <div style={{ padding: '20px' }}>
      <TeacherProfile teacher={teacher} />
    </div>
  );
}

export default Dashboard;
