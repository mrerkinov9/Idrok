$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$node = 'C:\Users\ANUBIS PC\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$running = Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue
if (-not $running) {
    Start-Process -FilePath $node -ArgumentList 'server.js' -WorkingDirectory $root -WindowStyle Hidden
    Start-Sleep -Seconds 2
}
Start-Process 'http://localhost:4173/'
