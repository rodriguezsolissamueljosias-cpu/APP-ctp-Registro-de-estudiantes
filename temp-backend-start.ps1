$VerbosePreference = 'Continue'
Set-Location 'C:\Users\san29\OneDrive\Escritorio\ctp-platanar\ctp-platanar-backend'

# Verificar e instalar dependencias si es necesario
if (-not (Test-Path 'node_modules')) {
    Write-Host 'Instalando dependencias del backend...' -ForegroundColor Yellow
    npm install
}

Write-Host 'Backend iniciado. Presiona Ctrl+C para detener.' -ForegroundColor Green
Write-Host ''
npm start
