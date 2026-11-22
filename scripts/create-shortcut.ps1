[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
$IconPath = Join-Path $Root 'assets\app.ico'

if (-not (Test-Path $IconPath)) {
  Write-Host 'Генерация иконки...'
  & node (Join-Path $Root 'scripts\make-icon.mjs')
  if ($LASTEXITCODE -ne 0) { throw 'Не удалось создать иконку' }
}

$Desktop = [Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $Desktop 'Сфера CRM.lnk'
$PowerShellPath = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($ShortcutPath)
$shortcut.TargetPath = $PowerShellPath
$shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$Root\scripts\app.ps1`""
$shortcut.WorkingDirectory = $Root
$shortcut.IconLocation = "$IconPath,0"
$shortcut.Description = 'Сфера CRM — клиенты, сделки и воронка продаж'
$shortcut.Save()

if (-not (Test-Path $ShortcutPath)) {
  throw "Ярлык не создан: $ShortcutPath"
}

Write-Host "Ярлык создан: $ShortcutPath"
