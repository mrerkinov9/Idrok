$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$healthUrl = 'http://localhost:4173/api/health'

function Test-IdrokServer {
    try {
        $response = Invoke-RestMethod -Uri $healthUrl -TimeoutSec 1
        return $response.ok -eq $true -and $response.service -eq 'Idrok'
    } catch {
        return $false
    }
}

if (-not (Test-IdrokServer)) {
    $listener = Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue
    if ($listener) {
        Add-Type -AssemblyName PresentationFramework
        [System.Windows.MessageBox]::Show("4173-portni boshqa dastur ishlatyapti. Uni yoping va Idrokni qayta oching.", 'Idrok') | Out-Null
        exit 1
    }

    $nodeCommand = Get-Command node -ErrorAction SilentlyContinue
    $bundledNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
    $node = if ($nodeCommand) { $nodeCommand.Source } elseif (Test-Path -LiteralPath $bundledNode) { $bundledNode } else { $null }
    if (-not $node) {
        Add-Type -AssemblyName PresentationFramework
        [System.Windows.MessageBox]::Show("Idrok serverini ishga tushirish uchun Node.js topilmadi.", 'Idrok') | Out-Null
        exit 1
    }

    Start-Process -FilePath $node -ArgumentList 'server.js' -WorkingDirectory $root -WindowStyle Hidden
    for ($attempt = 0; $attempt -lt 30 -and -not (Test-IdrokServer); $attempt++) {
        Start-Sleep -Milliseconds 250
    }
}

if (-not (Test-IdrokServer)) {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show("Idrok serveri ishga tushmadi. IDROKNI-OCHISH.cmd faylini yana bir marta ochib ko'ring.", 'Idrok') | Out-Null
    exit 1
}

Start-Process 'http://localhost:4173/'
