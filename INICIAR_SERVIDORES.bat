@echo off
echo ========================================
echo   Iniciando servidores de NODO+
echo ========================================
echo.

echo [1/2] Iniciando Backend (Puerto 3001)...
start "Backend - NODO+" cmd /k "cd /d %~dp0backend && call npm.cmd run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Iniciando Frontend (Puerto 3000)...
start "Frontend - NODO+" cmd /k "cd /d %~dp0frontend && call npm.cmd run dev"

echo.
echo ========================================
echo   Servidores iniciados!
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Las ventanas de los servidores se abrieron en ventanas separadas.
echo NO CIERRES estas ventanas mientras uses la aplicacion.
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
