[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Url = 'http://127.0.0.1:4173'
$LogPath = Join-Path $Root 'server.log'

function Test-App {
  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

try {
  if (-not (Test-App)) {
    Start-Process -FilePath (Join-Path $Root 'node.exe') `
      -ArgumentList "`"$(Join-Path $Root 'server.mjs')`"" `
      -WorkingDirectory $Root -WindowStyle Hidden

    for ($i = 0; $i -lt 30; $i++) {
      Start-Sleep -Milliseconds 400
      if (Test-App) { break }
    }
  }

  if (-not (Test-App)) {
    throw "Сервер не запустился. Лог: $LogPath"
  }

  $ProfileDir = Join-Path $env:LOCALAPPDATA 'SferaCRM\Profile'
  New-Item -ItemType Directory -Force -Path $ProfileDir | Out-Null

  $Chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
  $Edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

  if (Test-Path $Chrome) { $Browser = $Chrome }
  elseif (Test-Path $Edge) { $Browser = $Edge }
  else { $Browser = $null }

  if (-not $Browser) {
    Start-Process $Url
    return
  }

  $BrowserArgs = @(
    "--app=$Url",
    '--window-size=1440,920',
    "--user-data-dir=$ProfileDir",
    '--no-first-run',
    '--no-default-browser-check'
  )

  $QuotedArgs = $BrowserArgs | ForEach-Object {
    if ($_ -match '\s') { '"' + $_ + '"' } else { $_ }
  }

  $StartInfo = New-Object System.Diagnostics.ProcessStartInfo
  $StartInfo.FileName = $Browser
  $StartInfo.Arguments = ($QuotedArgs -join ' ')
  $StartInfo.UseShellExecute = $true
  [System.Diagnostics.Process]::Start($StartInfo) | Out-Null
} catch {
  Add-Type -AssemblyName System.Windows.Forms
  [System.Windows.Forms.MessageBox]::Show(
    $_.Exception.Message,
    'Сфера CRM',
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Error
  ) | Out-Null
  exit 1
}
