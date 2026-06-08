# ============================================
# Script Principal para Arrancar Todo
# CTP Platanar - Backend + Frontend
# ============================================

Write-Host "╔════════════════════════════════════════╗"
Write-Host "║   CTP Platanar - Starting Application ║"
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green

$scriptPath = $PSScriptRoot
$backendPath = "$scriptPath\ctp-platanar-backend"
$frontendPath = "$scriptPath\ctp-platanar-frontend"

# Verificar si MySQL está corriendo
Write-Host ""
Write-Host "Verificando MySQL..." -ForegroundColor Cyan
$mysqlService = Get-Service | Where-Object {$_.Name -like "*MySQL*"} | Select-Object -First 1

if ($mysqlService) {
    if ($mysqlService.Status -ne 'Running') {
        Write-Host "Iniciando servicio MySQL..." -ForegroundColor Yellow
        Start-Service -Name $mysqlService.Name -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
    Write-Host "✓ MySQL está ejecutándose" -ForegroundColor Green
} else {
    Write-Host "⚠️  MySQL no encontrado. Asegúrate de tener MySQL instalado como servicio." -ForegroundColor Yellow
    Write-Host "Ejecuta primero: .\setup-mysql-service.ps1" -ForegroundColor Cyan
}

# Iniciar Backend en ventana separada
Write-Host ""
Write-Host "Iniciando Backend (en ventana separada)..." -ForegroundColor Cyan
Write-Host "El backend se conectará a MySQL y se ejecutará en puerto 5000" -ForegroundColor Gray

$backendScript = @"
`$VerbosePreference = 'Continue'
Set-Location '$backendPath'

# Verificar e instalar dependencias si es necesario
if (-not (Test-Path 'node_modules')) {
    Write-Host 'Instalando dependencias del backend...' -ForegroundColor Yellow
    npm install
}

Write-Host 'Backend iniciado. Presiona Ctrl+C para detener.' -ForegroundColor Green
Write-Host ''
npm start
"@

$backendScriptPath = "$scriptPath\temp-backend-start.ps1"
$backendScript | Set-Content $backendScriptPath

Start-Process PowerShell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $backendScriptPath
Write-Host "✓ Ventana del backend abierta" -ForegroundColor Green

# Esperar a que el backend esté listo
Write-Host ""
Write-Host "Esperando a que el Backend esté listo..." -ForegroundColor Yellow
$backendReady = $false
$waitTime = 0
$maxWait = 30

while (-not $backendReady -and $waitTime -lt $maxWait) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000" -ErrorAction SilentlyContinue
        $backendReady = $true
        Write-Host "✓ Backend está listo!" -ForegroundColor Green
    } catch {
        $waitTime += 2
        if ($waitTime -lt $maxWait) {
            Write-Host "  Esperando..." -ForegroundColor Gray
            Start-Sleep -Seconds 2
        }
    }
}

if (-not $backendReady) {
    Write-Host "⚠️  Backend tardó mucho en iniciar. Verifica la consola del backend para errores." -ForegroundColor Yellow
}

# Iniciar Frontend
Write-Host ""
Write-Host "Iniciando Frontend (en ventana separada)..." -ForegroundColor Cyan
Write-Host "El frontend se ejecutará en puerto 3000" -ForegroundColor Gray

$frontendScript = @"
`$VerbosePreference = 'Continue'
Set-Location '$frontendPath'

# Verificar e instalar dependencias si es necesario
if (-not (Test-Path 'node_modules')) {
    Write-Host 'Instalando dependencias del frontend...' -ForegroundColor Yellow
    npm install
}

Write-Host 'Frontend iniciado. Se abrirá en tu navegador automáticamente.' -ForegroundColor Green
Write-Host ''
npm start
"@

$frontendScriptPath = "$scriptPath\temp-frontend-start.ps1"
$frontendScript | Set-Content $frontendScriptPath

Start-Process PowerShell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $frontendScriptPath
Write-Host "✓ Ventana del frontend abierta" -ForegroundColor Green

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✓ Aplicación iniciada exitosamente!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Ambas ventanas se abrieron en PowerShell. Puedes cerrarlas independientemente." -ForegroundColor Gray
Write-Host ""
Write-Host "Presiona cualquier tecla en esta ventana para salir..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Limpiar archivos temporales
Remove-Item $backendScriptPath -ErrorAction SilentlyContinue
Remove-Item $frontendScriptPath -ErrorAction SilentlyContinue
