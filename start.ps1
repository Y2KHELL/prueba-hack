$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $root "backend"
$frontendDir = Join-Path $root "frontend"

Write-Host "========================================" -ForegroundColor Green
Write-Host "  AgroSoya - Iniciando servidores..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$logDir = Join-Path $root "logs"
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

$backendLog = Join-Path $logDir "backend.log"
$frontendLog = Join-Path $logDir "frontend.log"

Write-Host "[1/2] Iniciando backend (Flask)..." -ForegroundColor Yellow
$backendJob = Start-Job -Name "agrosoya-backend" -ScriptBlock {
    param($dir, $log)
    Set-Location $dir
    python main.py *>&1 | Out-File -FilePath $log -Force
} -ArgumentList $backendDir, $backendLog

Start-Sleep -Seconds 3

$backendRunning = $false
for ($i = 0; $i -lt 10; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:5000/api/campaigns/" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        if ($r.StatusCode -eq 200) { $backendRunning = $true; break }
    } catch {}
    Start-Sleep -Seconds 1
}

if ($backendRunning) {
    Write-Host "  -> Backend corriendo en http://localhost:5000" -ForegroundColor Green
} else {
    Write-Host "  -> ERROR: Backend no respondio. Revisa logs/backend.log" -ForegroundColor Red
}

Write-Host ""
Write-Host "[2/2] Iniciando frontend (Vite)..." -ForegroundColor Yellow
$frontendJob = Start-Job -Name "agrosoya-frontend" -ScriptBlock {
    param($dir, $log)
    Set-Location $dir
    npx vite --port 5173 *>&1 | Out-File -FilePath $log -Force
} -ArgumentList $frontendDir, $frontendLog

Start-Sleep -Seconds 4

$frontendRunning = $false
for ($i = 0; $i -lt 10; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:5173/" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        if ($r.StatusCode -eq 200) { $frontendRunning = $true; break }
    } catch {}
    Start-Sleep -Seconds 1
}

if ($frontendRunning) {
    Write-Host "  -> Frontend corriendo en http://localhost:5173" -ForegroundColor Green
} else {
    Write-Host "  -> ERROR: Frontend no respondio. Revisa logs/frontend.log" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  AgroSoya esta funcionando!" -ForegroundColor Green
Write-Host "  Abri: http://localhost:5173" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para detener los servidores, ejecuta: Stop-Job -Name agrosoya-*; Remove-Job -Name agrosoya-* -Force" -ForegroundColor Gray

while ($true) {
    $backendState = (Get-Job -Name "agrosoya-backend" -ErrorAction SilentlyContinue).State
    $frontendState = (Get-Job -Name "agrosoya-frontend" -ErrorAction SilentlyContinue).State
    if ($backendState -ne "Running" -or $frontendState -ne "Running") {
        Write-Host "Un servidor se detuvo. Backend: $backendState, Frontend: $frontendState" -ForegroundColor Red
        break
    }
    Start-Sleep -Seconds 5
}
