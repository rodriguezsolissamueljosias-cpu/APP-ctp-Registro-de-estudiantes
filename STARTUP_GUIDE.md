# 🎓 CTP Platanar - Aplicación Web de Asistencia

## ✅ Estado Actual

✓ Aplicación **WEB** (sin versión de escritorio)  
✓ Frontend + Backend automáticamente conectados  
✓ Base de datos MySQL en servicio de Windows  
✓ Diseño y colores mantenidos tal como están  

---

## 🚀 Inicio Rápido

### 1️⃣ Prerequisitos

Asegúrate de tener instalado:
- **Node.js** (v14 o superior) - [Descargar](https://nodejs.org)
- **MySQL** - [Descargar Community Server](https://dev.mysql.com/downloads/mysql/)
  - Durante la instalación, marca: ✓ "Configure MySQL Server as a Windows Service"
  - Marca: ✓ "Start the MySQL Server at System Startup"

### 2️⃣ Configurar MySQL como Servicio Persistente

Ejecuta PowerShell como **administrador** y corre:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser
.\setup-mysql-service.ps1
```

✅ MySQL ahora:
- Se ejecuta automáticamente al iniciar Windows
- Se mantiene activo todo el día
- Persiste aunque cierres VS Code

### 3️⃣ Instalar Dependencias (Primera vez)

```powershell
npm run install-deps
```

Esto instala todas las librerías para:
- Backend (Express, Sequelize)
- Frontend (React, Axios)

### 4️⃣ Arrancar la Aplicación

**Opción A: Script automático (RECOMENDADO)**
```powershell
.\start-app.ps1
```
- Inicia MySQL automáticamente
- Abre Backend en ventana separada (puerto 5000)
- Abre Frontend en ventana separada (puerto 3000)
- Se abre en navegador automáticamente

**Opción B: Manualmente en dos terminales**

Terminal 1 (Backend):
```powershell
npm run backend:dev
```

Terminal 2 (Frontend):
```powershell
npm run frontend
```

---

## 🌐 URLs de Acceso

| Servicio | URL | Puerto |
|----------|-----|--------|
| Frontend (Interfaz gráfica) | http://localhost:3000 | 3000 |
| Backend (API) | http://localhost:5000 | 5000 |
| Health Check | http://localhost:5000/health | 5000 |

---

## 📁 Estructura del Proyecto

```
ctp-platanar/
├── ctp-platanar-frontend/        # React - Interfaz gráfica
│   ├── src/
│   │   ├── components/           # Componentes reutilizables
│   │   ├── pages/                # Páginas principales
│   │   ├── utils/
│   │   │   └── api.js           # Cliente HTTP (conecta al backend)
│   │   └── App.js
│   └── .env                      # Configuración del frontend
│
├── ctp-platanar-backend/         # Node.js + Express - API REST
│   ├── models/                   # Modelos Sequelize (BD)
│   ├── routes/                   # Rutas API
│   ├── server.js                 # Servidor principal
│   ├── db.js                     # Configuración Sequelize
│   └── .env                      # Credenciales de BD
│
├── start-app.ps1                 # Script para arrancar todo
├── setup-mysql-service.ps1       # Script para configurar MySQL
└── package.json                  # Dependencias del proyecto
```

---

## 🔌 Conexión Automática Frontend-Backend

El frontend **automáticamente se conecta al backend** sin necesidad de hacer nada:

1. ✓ Frontend en `http://localhost:3000`
2. ✓ Intenta conectar a Backend en `http://localhost:5000/api`
3. ✓ Si Backend responde → Todo funciona
4. ✓ Si Backend no responde → Muestra error, pero no cierra

**Archivo responsable:** `ctp-platanar-frontend/src/utils/api.js`

---

## 🗄️ Base de Datos Persistente

### MySQL se ejecuta como Servicio de Windows

```powershell
# Ver estado del servicio
Get-Service | Where-Object {$_.Name -like "*MySQL*"}

# Iniciar manualmente si es necesario
net start MySQL

# Detener
net stop MySQL
```

**La BD persiste:**
- ✅ Aunque cierres VS Code
- ✅ Aunque cierres las ventanas del Backend
- ✅ Aunque reinicies tu computadora

---

## 📊 Flujo de Datos

```
[Usuario en Navegador] 
        ↓
[Frontend React] (puerto 3000)
        ↓ HTTP (axios)
[Backend Express API] (puerto 5000)
        ↓
[MySQL Database] (persistente en Windows)
```

---

## 🛠️ Troubleshooting

### ❌ "Error: Cannot find module 'express'"
```powershell
npm run install-deps
```

### ❌ "Cannot connect to MySQL"
1. Abre Services (services.msc)
2. Busca "MySQL"
3. Si está roja (stopped), haz clic derecho → Start
4. Ejecuta: `.\setup-mysql-service.ps1`

### ❌ "Port 3000 already in use"
```powershell
# Matar proceso en puerto 3000
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Luego intenta nuevamente
npm run frontend
```

### ❌ "Frontend no se conecta al Backend"
Verifica en el navegador:
1. Abre DevTools (F12)
2. Ve a la consola
3. Debería decir "Backend connected" o similar
4. Si hay error, verifica que Backend esté corriendo: http://localhost:5000/health

---

## 📝 Credenciales por Defecto

**MySQL:**
- Host: `localhost`
- Usuario: `root`
- Contraseña: `sam2904` (verificar en `.env`)
- Base de datos: `ctp_platanar`

**JWT (Backend):**
- Secret: `ctp_platanar_secret_key_2026` (cambiar en producción)

---

## 🎨 Personalización

Todos los estilos están en los componentes. El diseño y colores están **exactamente como los dejaste**:
- Gradientes azul-púrpura
- Botones de colores (rosa, cyan, naranja)
- Cards con efectos hover
- Logo del colegio en esquina superior derecha

No se cambió nada del diseño.

---

## 🔄 Desarrollo

### Scripts útiles

```powershell
# Instalar deps
npm run install-deps

# Desarrollar con hot-reload
npm run backend:dev    # En terminal 1
npm run frontend       # En terminal 2

# Build production (Frontend)
npm run build-frontend

# Limpiar archivos temporales
npm run clean
```

---

## 📞 Notas Importantes

- **No confundas puertos:** Frontend = 3000, Backend = 5000
- **MySQL corre en background:** No necesitas ventana abierta
- **La BD persiste:** Todos tus datos se guardan
- **Hot-reload:** Si cambias código en Frontend, se actualiza automáticamente
- **CORS habilitado:** Frontend y Backend pueden comunicarse

---

## ✨ ¿Listo?

```powershell
# Abre PowerShell en este directorio
.\start-app.ps1
```

¡Tu aplicación se abrirá en http://localhost:3000! 🎉

