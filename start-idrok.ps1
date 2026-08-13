$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$bundledNode = 'C:\Users\ANUBIS PC\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$node = if (Test-Path -LiteralPath $bundledNode) { $bundledNode } else { (Get-Command node -ErrorAction Stop).Source }
$running = Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue
if (-not $running) {
    Start-Process -FilePath $node -ArgumentList 'server.js' -WorkingDirectory $root -WindowStyle Hidden
    Start-Sleep -Seconds 2
}
try {
    Invoke-WebRequest -Uri 'http://localhost:4173/api/health' -UseBasicParsing -TimeoutSec 5 | Out-Null
} catch {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show("Idrok serveri ishga tushmadi. Node.js o'rnatilganini tekshiring.", 'Idrok') | Out-Null
    exit 1
}
Start-Process 'http://localhost:4173/'
