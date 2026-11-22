[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
$Logs = Join-Path $Root '.logs'
$WebUrl = 'http://localhost:5173'
$WebPort = 5173
$ApiPort = 3000
$PgPort = 55432

$LogFile = Join-Path $Logs 'launcher.log'

function Write-Trace {
  param([string]$Message)
  try {
    New-Item -ItemType Directory -Force -Path $Logs | Out-Null
    Add-Content -Path $LogFile -Value ("{0}  {1}" -f (Get-Date -Format 'HH:mm:ss'), $Message)
  } catch {
    # диагностика не должна ломать запуск
  }
}

function Test-Port {
  param([int]$Port)

  # 127.0.0.1 не подходит: Vite слушает localhost (часто ::1).
  $listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if ($listener) { return $true }

  foreach ($address in @('127.0.0.1', '::1')) {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
      $async = $client.BeginConnect($address, $Port, $null, $null)
      if (-not $async.AsyncWaitHandle.WaitOne(300)) { continue }
      $client.EndConnect($async)
      return $true
    } catch {
      # пробуем следующий адрес
    } finally {
      $client.Close()
    }
  }

  return $false
}

function Test-Database {
  $pgIsReady = Join-Path $env:USERPROFILE '.devtools\pgsql\bin\pg_isready.exe'
  if (-not (Test-Path $pgIsReady)) { return $false }

  $previous = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    & $pgIsReady -h localhost -p $PgPort *> $null
    return $LASTEXITCODE -eq 0
  } finally {
    $ErrorActionPreference = $previous
  }
}

function Start-DevServers {
  New-Item -ItemType Directory -Force -Path $Logs | Out-Null
  $out = Join-Path $Logs 'dev.out.log'
  $err = Join-Path $Logs 'dev.err.log'

  # ShellExecute + редирект внутри cmd: процесс не наследует stdio лаунчера
  # и не удерживает вызывающий процесс.
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = 'cmd.exe'
  $psi.Arguments = "/c `"npm run dev > `"$out`" 2> `"$err`"`""
  $psi.WorkingDirectory = $Root
  $psi.UseShellExecute = $true
  $psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden

  [System.Diagnostics.Process]::Start($psi) | Out-Null
}

function Open-AppWindow {
  $profileDir = Join-Path $env:LOCALAPPDATA 'SferaCRM\Profile'
  New-Item -ItemType Directory -Force -Path $profileDir | Out-Null

  $appArgs = @(
    "--app=$WebUrl",
    '--window-size=1440,920',
    "--user-data-dir=$profileDir",
    '--no-first-run',
    '--no-default-browser-check'
  )

  $chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
  $edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

  if (Test-Path $chrome) { $browser = $chrome }
  elseif (Test-Path $edge) { $browser = $edge }
  else {
    Start-Process $WebUrl
    return
  }

  $quoted = $appArgs | ForEach-Object { if ($_ -match '\s') { '"' + $_ + '"' } else { $_ } }

  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $browser
  $psi.Arguments = ($quoted -join ' ')
  $psi.UseShellExecute = $true

  [System.Diagnostics.Process]::Start($psi) | Out-Null
}

try {
  Write-Trace 'launcher start'

  if (-not (Test-Database)) {
    Write-Trace 'database not ready, starting'
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $Root 'scripts\db.ps1') start
    if (-not (Test-Database)) {
      throw 'Не удалось запустить PostgreSQL. Выполните: npm run db:start'
    }
    Write-Trace 'database started'
  }

  if (-not (Test-Port $WebPort)) {
    Write-Trace 'starting dev servers'
    Start-DevServers
  } else {
    Write-Trace 'dev server already running'
  }

  $ready = $false
  $apiReady = $false

  for ($i = 0; $i -lt 225; $i++) {
    $ready = Test-Port $WebPort
    $apiReady = Test-Port $ApiPort
    if ($ready -and $apiReady) { break }
    if ($i % 25 -eq 0 -and $i -gt 0) {
      Write-Trace "still waiting (web=$ready, api=$apiReady)"
    }
    Start-Sleep -Milliseconds 400
  }

  Write-Trace "dev server ready: $ready, api ready: $apiReady"

  if (-not $ready) {
    throw "Сервер не запустился за 90 секунд. Логи: $Logs\dev.err.log"
  }

  Open-AppWindow
  Write-Trace 'app window opened'
} catch {
  Write-Trace ("error: " + $_.Exception.Message)
  Add-Type -AssemblyName System.Windows.Forms
  [System.Windows.Forms.MessageBox]::Show(
    $_.Exception.Message,
    'Сфера CRM',
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Error
  ) | Out-Null
  exit 1
}
