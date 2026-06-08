# ============================================
# Health Check - Verificar estado de todo
# CTP Platanar
# ============================================

Write-Host "╔════════════════════════════════════════╗"
Write-Host "║  CTP Platanar - Health Check         ║"
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# 1. Verificar Node.js
Write-Host "▶ Verificando Node.js..." -ForegroundColor Gray
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js no encontrado" -ForegroundColor Red
    $allGood = $false
}

# 2. Verificar npm
Write-Host "▶ Verificando npm..." -ForegroundColor Gray
try {
    $npmVersion = npm -v
    Write-Host "✓ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm no encontrado" -ForegroundColor Red
    $allGood = $false
}

# 3. Verificar MySQL Service
Write-Host "▶ Verificando MySQL..." -ForegroundColor Gray
$mysqlService = Get-Service | Where-Object {$_.Name -like "*MySQL*"} | Select-Object -First 1

if ($mysqlService) {
    $status = if ($mysqlService.Status -eq 'Running') { "Running ✓" } else { "Stopped ✗" }
    $statusColor = if ($mysqlService.Status -eq 'Running') { 'Green' } else { 'Yellow' }
    Write-Host "✓ MySQL Service encontrado: $($mysqlService.Name)" -ForegroundColor Green
    Write-Host "  Estado: $status" -ForegroundColor $statusColor
    
    if ($mysqlService.Status -ne 'Running') {
        $allGood = $false
        Write-Host "  ⚠️  Usa 'net start MySQL' para iniciar el servicio" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ MySQL Service no encontrado" -ForegroundColor Red
    Write-Host "  Ejecuta: .\setup-mysql-service.ps1" -ForegroundColor Yellow
    $allGood = $false
}

# 4. Verificar Backend Dependencies
Write-Host "▶ Verificando dependencias Backend..." -ForegroundColor Gray
$backendNodeModules = Test-Path ".\ctp-platanar-backend\node_modules"
if ($backendNodeModules) {
    Write-Host "✓ Backend dependencies instaladas" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend dependencies NO instaladas" -ForegroundColor Yellow
    Write-Host "  Ejecuta: npm run install-deps" -ForegroundColor Cyan
}

# 5. Verificar Frontend Dependencies
Write-Host "▶ Verificando dependencias Frontend..." -ForegroundColor Gray
$frontendNodeModules = Test-Path ".\ctp-platanar-frontend\node_modules"
if ($frontendNodeModules) {
    Write-Host "✓ Frontend dependencies instaladas" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend dependencies NO instaladas" -ForegroundColor Yellow
    Write-Host "  Ejecuta: npm run install-deps" -ForegroundColor Cyan
}

# 6. Verificar Backend .env
Write-Host "▶ Verificando Backend .env..." -ForegroundColor Gray
$backendEnv = Test-Path ".\ctp-platanar-backend\.env"
if ($backendEnv) {
    Write-Host "✓ Backend .env existe" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend .env NO encontrado" -ForegroundColor Yellow
    Write-Host "  Se creará automáticamente al iniciar" -ForegroundColor Cyan
}

# 7. Verificar Frontend .env
Write-Host "▶ Verificando Frontend .env..." -ForegroundColor Gray
$frontendEnv = Test-Path ".\ctp-platanar-frontend\.env"
if ($frontendEnv) {
    Write-Host "✓ Frontend .env existe" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend .env NO encontrado" -ForegroundColor Yellow
}

# 8. Intentar conectar a MySQL
Write-Host "▶ Verificando conexión a MySQL..." -ForegroundColor Gray
if (Test-Path ".\ctp-platanar-backend\.env") {
    $testConnection = @"
require('dotenv').config({ path: './ctp-platanar-backend/.env' });
const mysql = require('mysql2/promise');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ctp_platanar'
    });
    console.log('SUCCESS');
    await connection.end();
  } catch (err) {
    console.log('FAILED:' + err.message);
  }
})();
"@
    
    $result = node -e $testConnection 2>$null
    
    if ($result -like "*SUCCESS*") {
        Write-Host "✓ Conexión a MySQL exitosa" -ForegroundColor Green
    } else {
        Write-Host "✗ No se puede conectar a MySQL" -ForegroundColor Red
        Write-Host "  Verifica credenciales en: ctp-platanar-backend\.env" -ForegroundColor Yellow
        $allGood = $false
    }
} else {
    Write-Host "⚠️  No se puede verificar (falta .env)" -ForegroundColor Yellow
}

# 9. Resumen
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "✓ SISTEMA LISTO PARA USAR" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ejecuta para arrancar:" -ForegroundColor Green
    Write-Host "  .\start-app.ps1" -ForegroundColor White
} else {
    Write-Host "⚠️  FALTAN ALGUNAS COSAS" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor Yellow
    Write-Host "  1. npm run install-deps" -ForegroundColor Cyan
    Write-Host "  2. .\setup-mysql-service.ps1 (como admin)" -ForegroundColor Cyan
    Write-Host "  3. .\start-app.ps1" -ForegroundColor Cyan
}

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
