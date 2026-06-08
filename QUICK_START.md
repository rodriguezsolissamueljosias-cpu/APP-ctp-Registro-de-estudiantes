# 🚀 INICIO RÁPIDO - CTP Platanar Desktop

## ¡La aplicación ahora es una app de escritorio! ✨

La conversión a Electron está completada. Aquí hay los pasos para empezar:

## 1️⃣ Instalar dependencias (1 minuto)

### Windows (PowerShell)
```powershell
.\run.ps1 -Command setup
```

### Windows (CMD)
```cmd
install.bat
```

### Linux/Mac
```bash
chmod +x run.sh
./run.sh setup
```

## 2️⃣ Configurar base de datos

### Opción A: MySQL (Desarrollo)
```bash
cd ctp-platanar-backend
```

Editar `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=ctp_platanar
NODE_ENV=development
```

Luego crear BD:
```powershell
# PowerShell
.\scripts\run_create_db.ps1

# O MySQL directamente
mysql -u root -p < scripts/create_db.sql
```

### Opción B: SQLite (Recomendado para Producción)
En `.env`:
```env
NODE_ENV=production
```

SQLite se crea automáticamente en `ctp-platanar-backend/data/database.sqlite`

## 3️⃣ Iniciar la aplicación

### Producción
```powershell
npm start
```

### Desarrollo (con hot-reload)
```powershell
npm run dev
```

## 4️⃣ Compilar para distribución

### Crear instalador Windows
```powershell
npm run dist:win
```

Genera en `dist/`:
- `CTP Platanar Setup X.X.X.exe` (Instalador)
- `CTP Platanar X.X.X.exe` (Portable)

### Crear instalador Mac
```bash
npm run dist:mac
```

### Crear instalador Linux
```bash
npm run dist:linux
```

## 📁 Archivos importantes generados

- `electron-main.js` - Punto de entrada Electron
- `preload.js` - Seguridad IPC
- `.env` - Variables de entorno
- `DESKTOP_README.md` - Documentación completa

## 🔍 Verificación

Abrir DevTools en la app:
- `F12` o `Ctrl+Shift+I`

Ver logs del backend:
- Se muestran en la consola de DevTools

## 💡 Diferencias con versión web

| Aspecto | Web | Desktop |
|---------|-----|---------|
| Puerto | 3000 + 5000 | 5000 (interno) |
| Actualización | Manual | Electron auto-updater (futuro) |
| BD | MySQL/PostgreSQL | MySQL o SQLite |
| Distribución | Docker/Servidor | .exe/.dmg/.deb |

## ⚠️ Importante

- `npm start` solo en Windows
- En Linux/Mac: necesitas compilar primero o usar `npm run dev`
- Para producción: cambiar `JWT_SECRET` en `.env`
- Base de datos MySQL debe estar corriendo en desarrollo

## 🆘 Solución de problemas

### "Port 5000 already in use"
```powershell
# Encontrar proceso
Get-NetTCPConnection -LocalPort 5000 | Format-Table -AutoSize

# Terminar
Stop-Process -Id <PID> -Force
```

### "Cannot find module 'electron'"
```bash
npm install
npm run build-backend-deps
npm run build-frontend
```

### "Database connection failed"
- Verificar que MySQL esté corriendo
- Revisar credenciales en `.env`
- Ejecutar script de BD nuevamente

---

**¿Necesitas más ayuda?** Ver `DESKTOP_README.md` para documentación completa.

**Última actualización:** Junio 2026
