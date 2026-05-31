@echo off
cd /d "%~dp0"
echo ========================================
echo   AgroSoya - Iniciando servidores...
echo ========================================
echo.

echo [1/2] Iniciando backend (Flask)...
start /B "" "cmd.exe" /c "cd /d "%~dp0backend" && python main.py"
timeout /t 4 /nobreak >nul
echo   - Backend corriendo en http://localhost:5000

echo.
echo [2/2] Iniciando frontend (Vite)...
start /B "" "cmd.exe" /c "cd /d "%~dp0frontend" && npx vite --port 5173"
timeout /t 5 /nobreak >nul
echo   - Frontend corriendo en http://localhost:5173

echo.
echo ========================================
echo   AgroSoya esta funcionando!
echo   Abri: http://localhost:5173
echo ========================================
echo.
echo   Presiona cualquier tecla para detener los servidores...
pause >nul

taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
echo Servidores detenidos.
