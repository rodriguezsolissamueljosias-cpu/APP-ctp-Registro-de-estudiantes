Param(
    [string]$RootUser = 'root',
    [switch]$AskRootPassword
)

$sqlPath = Join-Path $PSScriptRoot 'create_db.sql'
if (-not (Test-Path $sqlPath)) {
    Write-Error "No se encontró $sqlPath"
    exit 1
}

$mysql = 'mysql'
try {
    if ($AskRootPassword) {
        Write-Host "Ejecutando y pidiendo contraseña de root..."
        Get-Content -Raw $sqlPath | & $mysql -u $RootUser -p
    } else {
        Write-Host "Ejecutando: Get-Content create_db.sql | mysql -u $RootUser"
        Get-Content -Raw $sqlPath | & $mysql -u $RootUser
    }
} catch {
    Write-Error "Error al ejecutar el cliente mysql: $_"
    Write-Host "Alternativa: desde CMD usa: mysql -u root -p < .\\scripts\\create_db.sql"
    exit 1
}
