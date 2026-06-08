# Arquitectura del Proyecto Sincronizado

```
┌─────────────────────────────────────────────────────────────────┐
│                       CTP PLATANAR                              │
│                  Sistema de Asistencia                          │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────┐  ┌──────────────────────────┐
│      FRONTEND (React)              │  │     BACKEND (Node.js)    │
│   Port: 3000                       │  │   Port: 5000             │
├────────────────────────────────────┤  ├──────────────────────────┤
│                                    │  │                          │
│  .env                              │  │  .env                    │
│  REACT_APP_API_URL=               │  │  DB_HOST=localhost       │
│  http://localhost:5000/api        │  │  DB_USER=root            │
│                                    │  │  DB_PASSWORD=***         │
│  src/                              │  │  PORT=5000               │
│  ├── utils/api.js                 │  │                          │
│  │   (Cliente API centralizado)   │  │  server.js               │
│  │                                 │  │  db.js                   │
│  ├── components/                  │  │                          │
│  │   ├── TeacherProfile.js ──────┼──┼──→ POST /api/students    │
│  │   └── ...                      │  │   GET /api/students/:id  │
│  │                                 │  │                          │
│  ├── pages/                        │  │  routes/                 │
│  │   ├── AttendanceDashboard.js ──┼──┼──→ POST /api/attendance  │
│  │   ├── JustificationDashboard.js┼──┼──→ GET /api/attendance   │
│  │   └── ...                      │  │   PUT /api/attendance/:id│
│  │                                 │  │                          │
│  └── App.js                        │  │   GET /api/teachers      │
│                                    │  │   POST /api/teachers     │
│                                    │  │                          │
│                                    │  │  models/                 │
│                                    │  │  ├── Teacher.js          │
│                                    │  │  ├── Student.js          │
│                                    │  │  └── Attendance.js       │
└────────────────────────────────────┘  └──────────────────────────┘
         │                                         │
         └─────────────── HTTP/REST ─────────────┘

┌──────────────────────────────────────────────────────────────────┐
│              DATABASE LAYER                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  MySQL (ctp_platanar)                                            │
│  ├── Teachers                                                    │
│  │   ├── id (auto)                                               │
│  │   ├── teacherId (string, unique)                              │
│  │   ├── name                                                    │
│  │   ├── phone                                                   │
│  │   ├── email (unique)                                          │
│  │   ├── password (hashed)                                       │
│  │   └── subject                                                 │
│  │                                                               │
│  ├── Students                                                    │
│  │   ├── id (PK)                                                 │
│  │   ├── name                                                    │
│  │   ├── grade                                                   │
│  │   ├── section                                                 │
│  │   ├── parentEmail                                             │
│  │   └── teacherId (FK → Teachers)                               │
│  │                                                               │
│  └── Attendances                                                 │
│      ├── id (PK)                                                 │
│      ├── date                                                    │
│      ├── status (Presente, Tarde, Ausente, Justificado)         │
│      └── studentId (FK → Students)                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘


FLUJO DE DATOS - EJEMPLO: Registrar Asistencia
════════════════════════════════════════════════

1. Usuario selecciona estado en AttendanceDashboard
        ↓
2. Componente llama: markAttendance(studentId, status)
        ↓
3. attendanceAPI.create({ studentId, date, status })
        ↓
4. Axios hace POST a http://localhost:5000/api/attendance
        ↓
5. Backend recibe en: routes/attendance.js
        ↓
6. Sequelize crea registro en BD: Attendance.create(req.body)
        ↓
7. Respuesta JSON vuelve al frontend
        ↓
8. UI actualiza y muestra confirmación


SINCRONIZACIÓN - FLUJO DE TECNOLOGÍAS
══════════════════════════════════════

Frontend                Backend                Database
─────────────────────────────────────────────────────────
React Components    Express Routes         Sequelize ORM
    ↓                    ↓                      ↓
Axios Client        Node.js Server          MySQL DB
    ↓                    ↓                      ↓
.env URL ──────→ .env config ────────→ Credenciales seguras


ARCHIVOS ELIMINADOS (Desincronización)
═══════════════════════════════════════
❌ auth.js (MongoDB syntax, no usado)
❌ studentRoutes.js (MongoDB syntax, no usado)
❌ teacherRoutes.js (MongoDB syntax, no usado)

ARCHIVOS MANTENIDOS (Sincronizados con Sequelize)
═════════════════════════════════════════════════
✅ teachers.js (Sequelize)
✅ students.js (Sequelize)
✅ attendance.js (Sequelize)


BENEFICIOS DE LA SINCRONIZACIÓN
═════════════════════════════════

1. UNA SOLA FUENTE DE VERDAD
   - Una BD: MySQL
   - Una versión de rutas: Sequelize
   - Una URL API: variables de entorno

2. SEGURIDAD
   - Credenciales en .env (no en git)
   - .gitignore protege archivos sensibles

3. MANTENIBILIDAD
   - API centralizada (utils/api.js)
   - Cambios en una línea afectan todo
   - Fácil de testear

4. ESCALABILIDAD
   - Estructura lista para autenticación JWT
   - Modelos preparados para relaciones
   - Base de datos normalizada

5. PORTABILIDAD
   - Funciona en diferentes ambientes
   - Solo cambiar variables de entorno
   - Compatible con Docker/Kubernetes
```

## Estado del Proyecto

- ✅ **Backend:** Sincronizado con Sequelize + MySQL
- ✅ **Frontend:** Sincronizado con API centralizada
- ✅ **Configuración:** Variables de entorno
- ✅ **Documentación:** README + CAMBIOS
- ✅ **Seguridad:** .gitignore + .env
- ⏳ **Próximo:** Desplegar a producción
