@echo off
setlocal
cd /d "%~dp0"
set "REVELA_URL=http://localhost:3012"
set "REVELA_CHECK=& { try { (Invoke-WebRequest -UseBasicParsing -Uri '%REVELA_URL%/media/revela.svg' -TimeoutSec 4).StatusCode -eq 200 } catch { $false } }"
where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo Instale o Node.js para iniciar o site.
  pause
  exit /b 1
)
if not exist "node_modules\next\package.json" (
  call npm ci
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
powershell -NoProfile -Command "if (%REVELA_CHECK%) { exit 0 }; exit 1"
if errorlevel 1 start "Clinica Revela" /min cmd.exe /d /c "npm run dev -- --port 3012"
powershell -NoProfile -Command "for ($attempt=0; $attempt -lt 30; $attempt++) { if (%REVELA_CHECK%) { Start-Process '%REVELA_URL%'; exit 0 }; Start-Sleep -Seconds 1 }; exit 1"
if errorlevel 1 (
  echo O site nao respondeu na porta 3012. Confira a janela do servidor.
  pause
)
