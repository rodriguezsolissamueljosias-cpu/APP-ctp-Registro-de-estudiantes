# ============================================
# Backend Auto-Start Script para CTP Platanar
# Verifica BD, crea tablas y arranca el servidor
# ============================================

Write-Host "╔════════════════════════════════════════╗"
Write-Host "║  CTP Platanar - Backend Starting...   ║"
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan

$maxRetries = 5
$retryDelay = 2  # segundos
$retryCount = 0

Write-Host ""
Write-Host "Verificando Base de Datos MySQL..." -ForegroundColor Cyan

# Cambiar al directorio del backend
Set-Location "$PSScriptRoot\ctp-platanar-backend"

# Verificar si existe .env
if (-not (Test-Path ".\.env")) {
    Write-Host "⚠️  Archivo .env no encontrado. Creando archivo por defecto..." -ForegroundColor Yellow
    @"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ctp_platanar
DB_PORT=3306
NODE_ENV=development
JWT_SECRET=tu_secreto_jwt_aqui_cambiar
PORT=5000
"@ | Set-Content ".\.env"
    Write-Host "✓ Archivo .env creado. Por favor verifica las credenciales si es necesario." -ForegroundColor Green
}

Write-Host ""
Write-Host "Intentando conectar a la Base de Datos..." -ForegroundColor Cyan

# Intentar conectar a la BD con reintentos
$dbConnected = $false
do {
    $retryCount++
    Write-Host "Intento $retryCount/$maxRetries..." -ForegroundColor Gray
    
    # Usar node para verificar conexión
    $testConnection = @"
require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ctp_platanar'
    });
    console.log('CONNECTED');
    await connection.end();
  } catch (err) {
    console.log('FAILED');
  }
})();
"@
    
    $result = node -e $testConnection 2>$null
    
    if ($result -like "*CONNECTED*") {
        $dbConnected = $true
        Write-Host "✓ Conexión a BD exitosa!" -ForegroundColor Green
        break
    } else {
        Write-Host "✗ No se puede conectar a la BD" -ForegroundColor Red
        if ($retryCount -lt $maxRetries) {
            Write-Host "Esperando $retryDelay segundos antes de reintentar..." -ForegroundColor Yellow
            Start-Sleep -Seconds $retryDelay
        }
    }
} while ($retryCount -lt $maxRetries)

if (-not $dbConnected) {
    Write-Host ""
    Write-Host "⚠️  No se puede conectar a MySQL. Verifica:" -ForegroundColor Red
    Write-Host "  1. MySQL está instalado y ejecutándose como servicio" -ForegroundColor Yellow
    Write-Host "  2. Las credenciales en .env son correctas" -ForegroundColor Yellow
    Write-Host "  3. El servicio MySQL está activo (Services -> MySQL)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para iniciar MySQL manualmente (administrador requerido):" -ForegroundColor Yellow
    Write-Host "  net start MySQL" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Iniciando servidor backend en puerto 5000..." -ForegroundColor Cyan
Write-Host "El backend estará disponible en: http://localhost:5000" -ForegroundColor Green
Write-Host ""

npm start
