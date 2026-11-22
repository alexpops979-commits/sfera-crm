[CmdletBinding()]
param(
  [ValidateSet('init', 'start', 'stop', 'restart', 'status', 'psql')]
  [string]$Command = 'start'
)

$ErrorActionPreference = 'Stop'

$PgRoot = Join-Path $env:USERPROFILE '.devtools\pgsql'
$PgBin = Join-Path $PgRoot 'bin'
$PgData = Join-Path $env:USERPROFILE '.devtools\pgdata'
$PgLog = Join-Path $PgData 'server.log'
$Port = 55432

$PgCtl = Join-Path $PgBin 'pg_ctl.exe'
$InitDb = Join-Path $PgBin 'initdb.exe'
$Psql = Join-Path $PgBin 'psql.exe'

$Databases = @('crm_dev', 'crm_test', 'crm_shadow')

if (-not (Test-Path $PgCtl)) {
  throw "PostgreSQL не найден в $PgRoot. Запустите: powershell -File scripts/setup-tools.ps1"
}

# Запускает внешнюю программу, не превращая stderr в terminating error (PS 5.1).
function Invoke-Tool {
  param(
    [Parameter(Mandatory)][string]$Exe,
    [string[]]$ToolArgs = @()
  )

  $previous = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    $output = & $Exe @ToolArgs 2>&1
    $code = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $previous
  }

  [pscustomobject]@{
    Code   = $code
    Output = (($output | ForEach-Object { "$_" }) -join "`n")
  }
}

function Test-ClusterReady {
  return Test-Path (Join-Path $PgData 'PG_VERSION')
}

function Test-Running {
  if (-not (Test-ClusterReady)) { return $false }
  return (Invoke-Tool $PgCtl @('status', '-D', $PgData)).Code -eq 0
}

function Start-Cluster {
  if (Test-Running) {
    Write-Host "PostgreSQL уже работает (порт $Port)"
    return
  }

  # Start-Process без -Wait и с отвязанным stdio: иначе postmaster наследует
  # pipe родителя, и PowerShell ждёт закрытия дескриптора бесконечно.
  Start-Process -FilePath $PgCtl `
    -ArgumentList @('-D', $PgData, '-l', $PgLog, 'start') `
    -WindowStyle Hidden | Out-Null

  $isReady = Join-Path $PgBin 'pg_isready.exe'
  $ready = 1

  for ($i = 0; $i -lt 30; $i++) {
    $probe = Invoke-Tool $isReady @('-h', 'localhost', '-p', "$Port")
    $ready = $probe.Code
    if ($ready -eq 0) { break }
    Start-Sleep -Seconds 1
  }

  if ($ready -ne 0) {
    throw "PostgreSQL не отвечает на порту $Port. Лог: $PgLog"
  }

  Write-Host "PostgreSQL запущен на порту $Port"
}

function Invoke-Sql {
  param(
    [string]$Database,
    [string]$Sql,
    [switch]$Quiet
  )

  $previous = $env:PGCLIENTENCODING
  $env:PGCLIENTENCODING = 'UTF8'
  try {
    $result = Invoke-Tool $Psql @(
      '-w', '-h', 'localhost', '-p', "$Port", '-U', 'postgres',
      '-d', $Database, '-v', 'ON_ERROR_STOP=1', '-tAc', $Sql
    )
  } finally {
    $env:PGCLIENTENCODING = $previous
  }

  if (-not $Quiet -and $result.Code -ne 0) {
    throw "SQL завершился с ошибкой:`n$($result.Output)"
  }

  return $result
}

function Initialize-Cluster {
  if (Test-ClusterReady) {
    Write-Host "Кластер уже инициализирован: $PgData"
    return
  }

  New-Item -ItemType Directory -Force -Path $PgData | Out-Null
  Write-Host 'Инициализация кластера PostgreSQL...'

  $utf8 = Invoke-Tool $InitDb @('-D', $PgData, '-U', 'postgres', '--encoding=UTF8', '--locale=C', '--no-sync')

  if ($utf8.Code -ne 0) {
    # Известная проблема PostgreSQL на Windows: initdb в single-user режиме
    # подставляет имя пользователя ОС в ANSI-кодировке. При кириллице в имени
    # UTF8-кластер не создаётся. Обход: кластер WIN1251 + рабочие базы UTF8
    # из template0 (см. README).
    Write-Warning 'UTF8-кластер не создан (не-ASCII имя пользователя Windows). Использую: WIN1251-кластер + UTF8-базы.'

    Remove-Item -Recurse -Force $PgData -ErrorAction SilentlyContinue
    New-Item -ItemType Directory -Force -Path $PgData | Out-Null

    $win = Invoke-Tool $InitDb @('-D', $PgData, '-U', 'postgres', '--encoding=WIN1251', '--locale=C', '--no-sync')
    if ($win.Code -ne 0) {
      throw "initdb завершился с ошибкой. Проверьте права на каталог и свободное место.`n$($win.Output)"
    }
  }

  Add-Content -Path (Join-Path $PgData 'postgresql.conf') `
    -Value "`n# --- CRM dev ---`nport = $Port`nlisten_addresses = 'localhost'`n"

  Start-Cluster
}

function Ensure-Databases {
  foreach ($db in $Databases) {
    $exists = Invoke-Sql -Database 'postgres' -Sql "SELECT 1 FROM pg_database WHERE datname = '$db'"
    if ($exists.Output.Trim() -eq '1') { continue }

    $icu = Invoke-Sql -Database 'postgres' -Quiet `
      -Sql "CREATE DATABASE `"$db`" TEMPLATE template0 ENCODING 'UTF8' LOCALE_PROVIDER icu ICU_LOCALE 'ru-RU' LC_COLLATE 'C' LC_CTYPE 'C'"

    if ($icu.Code -ne 0) {
      $plain = Invoke-Sql -Database 'postgres' -Quiet `
        -Sql "CREATE DATABASE `"$db`" TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C'"
      if ($plain.Code -ne 0) {
        throw "Не удалось создать базу ${db}:`n$($plain.Output)"
      }
    }

    Write-Host "Создана база $db (UTF8)"
  }
}

switch ($Command) {
  'init' {
    Initialize-Cluster
    Ensure-Databases
  }
  'start' {
    if (-not (Test-ClusterReady)) { Initialize-Cluster }
    else { Start-Cluster }
    Ensure-Databases
  }
  'stop' {
    if (Test-Running) {
      Invoke-Tool $PgCtl @('-D', $PgData, '-m', 'fast', '-w', 'stop') | Out-Null
      Write-Host 'PostgreSQL остановлен'
    } else {
      Write-Host 'PostgreSQL не запущен'
    }
  }
  'restart' {
    if (Test-Running) { Invoke-Tool $PgCtl @('-D', $PgData, '-m', 'fast', '-w', 'stop') | Out-Null }
    Start-Cluster
  }
  'status' {
    if (Test-Running) { Write-Host "running (порт $Port, данные: $PgData)" }
    else { Write-Host 'stopped' }
  }
  'psql' {
    if (-not (Test-Running)) { throw 'PostgreSQL не запущен. Выполните: npm run db:start' }
    $env:PGCLIENTENCODING = 'UTF8'
    & $Psql -h localhost -p $Port -U postgres -d crm_dev
  }
}
