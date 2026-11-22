# Скачивает портативные PostgreSQL 17 и Git в %USERPROFILE%\.devtools
# Права администратора не нужны.
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$ToolDir = Join-Path $env:USERPROFILE '.devtools'
$TmpDir = Join-Path $env:TEMP 'crm-tools'
New-Item -ItemType Directory -Force -Path $ToolDir, $TmpDir | Out-Null

$PgRoot = Join-Path $ToolDir 'pgsql'
$PgZip = Join-Path $TmpDir 'pgsql.zip'

if (Test-Path (Join-Path $PgRoot 'bin\pg_ctl.exe')) {
  Write-Host "PostgreSQL уже установлен: $PgRoot"
} else {
  Write-Host 'Скачивание PostgreSQL 17 (≈315 МБ)...'
  Invoke-WebRequest `
    -Uri 'https://get.enterprisedb.com/postgresql/postgresql-17.8-1-windows-x64-binaries.zip' `
    -OutFile $PgZip -UseBasicParsing

  Write-Host 'Распаковка PostgreSQL...'
  Expand-Archive -Path $PgZip -DestinationPath $ToolDir -Force
  Remove-Item $PgZip -Force
  Write-Host "PostgreSQL готов: $PgRoot"
}

$GitDir = Join-Path $ToolDir 'git'
$GitExe = Join-Path $TmpDir 'PortableGit.7z.exe'

if (Test-Path (Join-Path $GitDir 'bin\git.exe')) {
  Write-Host "Git уже установлен: $GitDir"
} else {
  Write-Host 'Скачивание portable Git (≈60 МБ)...'
  Invoke-WebRequest `
    -Uri 'https://github.com/git-for-windows/git/releases/download/v2.56.1.windows.1/PortableGit-2.56.1-64-bit.7z.exe' `
    -OutFile $GitExe -UseBasicParsing
  & $GitExe -o"$GitDir" -y | Out-Null
  Remove-Item $GitExe -Force
  Write-Host "Git готов: $GitDir"
}

Write-Host ''
Write-Host 'Готово. Дальше:'
Write-Host '  npm install'
Write-Host '  npm run db:start'
Write-Host '  npm run dev'
