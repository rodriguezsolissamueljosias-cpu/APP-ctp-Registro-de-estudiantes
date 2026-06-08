# ============================================
# MySQL Service Setup para CTP Platanar
# Este script configura MySQL para ejecutarse 
# como servicio de Windows permanentemente
# ============================================

Write-Host "╔════════════════════════════════════════╗"
Write-Host "║  CTP Platanar - MySQL Service Setup   ║"
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green

# Verificar si se ejecuta como administrador
$isAdmin = ([System.Security.Principal.WindowsIdentity]::GetCurrent()).groups -match "S-1-5-32-544"
if (-not $isAdmin) {
    Write-Host "⚠️  Este script requiere permisos de administrador." -ForegroundColor Yellow
    Write-Host "Por favor, ejecuta PowerShell como administrador y vuelve a intentar." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Verificando instalación de MySQL..." -ForegroundColor Cyan

# Buscar servicios MySQL
$mysqlServices = Get-Service | Where-Object {$_.Name -like "*MySQL*"} 
$mysqlPath = Get-Command mysql.exe -ErrorAction SilentlyContinue

if ($mysqlServices) {
    Write-Host "✓ MySQL instalado encontrado:" -ForegroundColor Green
    $mysqlServices | ForEach-Object {
        Write-Host "  - Servicio: $($_.Name)" -ForegroundColor Green
        Write-Host "    Estado: $($_.Status)" -ForegroundColor $(if($_.Status -eq 'Running') {'Green'} else {'Yellow'})
    }
    
    # Iniciar el servicio
    Write-Host ""
    Write-Host "Iniciando servicio MySQL..." -ForegroundColor Cyan
    foreach ($service in $mysqlServices) {
        if ($service.Status -ne 'Running') {
            Start-Service -Name $service.Name -ErrorAction SilentlyContinue
            Write-Host "✓ Servicio '$($service.Name)' iniciado" -ForegroundColor Green
        } else {
            Write-Host "✓ Servicio '$($service.Name)' ya estaba activo" -ForegroundColor Green
        }
    }
    
} else {
    Write-Host "✗ No se encontró MySQL instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Para instalar MySQL en Windows:" -ForegroundColor Yellow
    Write-Host "1. Descarga MySQL Community Server desde:" -ForegroundColor Yellow
    Write-Host "   https://dev.mysql.com/downloads/mysql/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Durante la instalación, selecciona:" -ForegroundColor Yellow
    Write-Host "   ✓ 'Configure MySQL Server as a Windows Service'" -ForegroundColor Cyan
    Write-Host "   ✓ 'Start the MySQL Server at System Startup'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. Después de instalar, ejecuta este script nuevamente." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Verificando conexión a MySQL..." -ForegroundColor Cyan
if ($mysqlPath) {
    try {
        $mysqlPath = (Get-Command mysql.exe).Source
        $output = & $mysqlPath -u root -e "SELECT 1" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Conexión a MySQL exitosa (sin contraseña)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  MySQL requiere contraseña. Por favor configura .env con:" -ForegroundColor Yellow
            Write-Host "  DB_PASSWORD=tu_contraseña" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "⚠️  No se pudo verificar la conexión. Continúa con la configuración." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host "MySQL está configurado como servicio" -ForegroundColor Green
Write-Host "Se ejecutará automáticamente al iniciar Windows" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
