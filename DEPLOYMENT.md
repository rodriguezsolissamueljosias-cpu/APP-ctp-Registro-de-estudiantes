# Despliegue en la nube

Este proyecto puede ejecutarse en un host de Node.js con backend Express y frontend React.

## 1. Backend en la nube

### Opciones recomendadas
- Render
- Railway
- Fly.io
- Heroku
- DigitalOcean App Platform

### Variables de entorno
- `NODE_ENV=production`
- `PORT=5000`
- `JWT_SECRET=tu_secreto_seguro`

Si usas una base de datos gestionada:
- `DATABASE_URL=mysql://user:password@host:3306/ctp_platanar`
- `DB_SSL=true` (si el proveedor requiere SSL)

Si no configuras `DATABASE_URL`, el backend usa:
- MySQL (`DB_DIALECT=mysql`) en desarrollo
- SQLite (`DB_DIALECT=sqlite`) cuando `NODE_ENV=production` o si lo defines explícitamente

### Notas de persistencia
- SQLite funciona si el host mantiene el archivo `ctp-platanar-backend/data/database.sqlite` después de reinicios.
- Para producción, lo más estable es usar MySQL o PostgreSQL con un servicio gestionado.

## 2. Frontend

### Variables de entorno
- `REACT_APP_API_URL=http://localhost:5000/api` (para local)
- `REACT_APP_API_URL=/api` (cuando el frontend se sirve desde el mismo backend)
- `REACT_APP_API_URL=https://mi-backend-en-la-nube.com/api` (cuando el frontend se publica por separado)

### Construcción
```bash
cd ctp-platanar-frontend
npm install
npm run build
```

### Despliegue en Render
- Define el build command:
  ```bash
  cd ctp-platanar-frontend && npm install && npm run build && cd ../ctp-platanar-backend && npm install
  ```
- Define el start command:
  ```bash
  cd ctp-platanar-backend && npm start
  ```
- Define estas variables en Render:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `JWT_SECRET=tu_secreto_seguro`
  - `DATABASE_URL=mysql://user:password@host:3306/ctp_platanar`
  - `DB_SSL=true` (si el proveedor de la base de datos lo requiere)
  - `REACT_APP_API_URL=/api`
- El backend servirá el frontend estático desde `ctp-platanar-frontend/build` cuando `NODE_ENV=production`.

## 3. Servir la app desde el backend

El backend ya está configurado para servir el build del frontend en producción.

1. Copia el contenido de `ctp-platanar-frontend/build` a `ctp-platanar-frontend/build` en el servidor.
2. Asegura que el backend se inicie con `npm start`.
3. El frontend y el backend estarán accesibles desde la misma URL pública.

## 4. Verificación

- Accede a `https://tu-backend-en-la-nube.com/health`
- Debe responder con `{ status: 'OK', message: 'Servidor funcionando correctamente' }`

## 5. Problema de persistencia

Si una sección se crea y desaparece después de reiniciar:
- Asegúrate de que el backend usa una base de datos persistente (no temporal).
- Si usas SQLite, revisa que `ctp-platanar-backend/data/database.sqlite` exista después de reiniciar.
- Si usas `DATABASE_URL`, valida que el servicio tenga datos guardados correctamente.
