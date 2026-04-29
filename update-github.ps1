# Script de PowerShell para actualizar el repositorio de GitHub
# Uso: .

param(
    [string]$RepoUrl = "https://github.com/claudio489/dyg-constructora-backend.git",
    [string]$RepoName = "dyg-constructora-backend",
    [string]$PackageJsonPath = ".\package.json",
    [string]$WorkingDir = "$env:TEMP\render-deploy"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  D&G Constructora - GitHub Updater" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Git
Write-Host "[1/6] Verificando Git..." -ForegroundColor Yellow
$gitCheck = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCheck) {
    Write-Host "ERROR: Git no esta instalado. Descargalo de https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}
Write-Host "      Git OK" -ForegroundColor Green

# 2. Crear directorio de trabajo
Write-Host "[2/6] Preparando directorio..." -ForegroundColor Yellow
if (Test-Path $WorkingDir) {
    Remove-Item -Path $WorkingDir -Recurse -Force
}
New-Item -ItemType Directory -Path $WorkingDir -Force | Out-Null
Set-Location $WorkingDir
Write-Host "      Directorio: $WorkingDir" -ForegroundColor Green

# 3. Clonar repositorio
Write-Host "[3/6] Clonando repositorio..." -ForegroundColor Yellow
Write-Host "      URL: $RepoUrl" -ForegroundColor Gray
$cloneResult = git clone $RepoUrl 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR al clonar: $cloneResult" -ForegroundColor Red
    exit 1
}
Write-Host "      Repo clonado OK" -ForegroundColor Green

# 4. Verificar que existe el package.json fuente
Write-Host "[4/6] Verificando package.json..." -ForegroundColor Yellow
$sourcePackage = Resolve-Path $PackageJsonPath -ErrorAction SilentlyContinue
if (-not $sourcePackage) {
    # Buscar en ubicaciones comunes
    $possiblePaths = @(
        "$PSScriptRoot\package.json",
        ".\package.json",
        "$env:USERPROFILE\Downloads\package.json"
    )
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $sourcePackage = Resolve-Path $path
            break
        }
    }
}

if (-not $sourcePackage) {
    Write-Host "ERROR: No encontre el archivo package.json" -ForegroundColor Red
    Write-Host "      Buscado en: $PackageJsonPath" -ForegroundColor Red
    Write-Host "      Coloca este script en la misma carpeta que package.json" -ForegroundColor Yellow
    exit 1
}
Write-Host "      Origen: $sourcePackage" -ForegroundColor Green

# 5. Copiar package.json
Write-Host "[5/6] Copiando package.json corregido..." -ForegroundColor Yellow
$destPackage = "$WorkingDir\$RepoName\package.json"
Copy-Item -Path $sourcePackage -Destination $destPackage -Force
Write-Host "      Copiado OK" -ForegroundColor Green

# 6. Git add, commit, push
Write-Host "[6/6] Subiendo cambios a GitHub..." -ForegroundColor Yellow
Set-Location "$WorkingDir\$RepoName"

git add package.json
git commit -m "fix: move vite, esbuild, plugin-react to dependencies for Render"

Write-Host "      Haciendo push..." -ForegroundColor Gray
$pushResult = git push origin main 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR al hacer push: $pushResult" -ForegroundColor Red
    Write-Host "      Posibles causas:" -ForegroundColor Yellow
    Write-Host "      - No tienes permisos de escritura en el repo" -ForegroundColor Yellow
    Write-Host "      - Necesitas configurar token de GitHub" -ForegroundColor Yellow
    Write-Host "      - Hay cambios en el remoto que no has bajado" -ForegroundColor Yellow
    exit 1
}

Write-Host "      Push OK" -ForegroundColor Green

# 7. Resultado
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ACTUALIZACION COMPLETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora ve a Render y haz:" -ForegroundColor Cyan
Write-Host "  1. Manual Deploy -> Deploy latest commit" -ForegroundColor White
Write-Host ""
Write-Host "O espera 1 minuto, Render deberia detectar" -ForegroundColor Cyan
Write-Host "el push automaticamente y redeployar." -ForegroundColor Cyan
Write-Host ""

# Volver al directorio original
Set-Location $PSScriptRoot
