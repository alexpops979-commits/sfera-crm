[CmdletBinding()]
param(
  [string]$Version = '0.1.0'
)

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
$Build = Join-Path $Root 'installer\build'
$Dist = Join-Path $Root 'dist'

# Inno Setup 6 — свободная лицензия, в отличие от 7.x (non-commercial).
$Iscc = Join-Path $env:USERPROFILE '.devtools\inno6\ISCC.exe'
if (-not (Test-Path $Iscc)) {
  $Iscc = Join-Path $env:USERPROFILE '.devtools\inno\ISCC.exe'
}

if (-not (Test-Path $Iscc)) {
  throw "Inno Setup не найден. Установите Inno Setup 6 в %USERPROFILE%\.devtools\inno6 (per-user)."
}

Write-Host '1/4 Сборка веб-приложения...'
& npm run build --workspace @crm/web
if ($LASTEXITCODE -ne 0) { throw 'Сборка веб-приложения завершилась с ошибкой' }

Write-Host '2/4 Подготовка файлов установщика...'
Remove-Item -Recurse -Force $Build -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path (Join-Path $Build 'app') | Out-Null

Copy-Item -Path (Join-Path $Root 'apps\web\dist\*') -Destination (Join-Path $Build 'app') -Recurse -Force
Copy-Item -Path (Join-Path $Root 'installer\payload\server.mjs') -Destination $Build -Force
Copy-Item -Path (Join-Path $Root 'installer\payload\launcher.ps1') -Destination $Build -Force
Copy-Item -Path (Join-Path $Root 'assets\app.ico') -Destination $Build -Force
Copy-Item -Path (Join-Path $Root 'LICENSE') -Destination (Join-Path $Build 'LICENSE.txt') -Force

$NodePath = (Get-Command node -ErrorAction Stop).Source
Copy-Item -Path $NodePath -Destination (Join-Path $Build 'node.exe') -Force

Write-Host '3/4 Компиляция установщика...'
New-Item -ItemType Directory -Force -Path $Dist | Out-Null
& $Iscc "/DAppVersion=$Version" (Join-Path $Root 'installer\SferaCRM.iss')
if ($LASTEXITCODE -ne 0) { throw 'Компиляция установщика завершилась с ошибкой' }

$SetupPath = Join-Path $Dist "SferaCRM-Setup-$Version.exe"
if (-not (Test-Path $SetupPath)) { throw "Установщик не найден: $SetupPath" }

$SizeMb = [math]::Round((Get-Item $SetupPath).Length / 1MB, 1)
Write-Host ''
Write-Host "4/4 Готово: $SetupPath ($SizeMb МБ)"
