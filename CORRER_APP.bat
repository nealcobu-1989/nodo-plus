@echo off
echo ========================================
echo    CORRIENDO NODO+ PLATAFORMA EDTECH
echo ========================================
echo.

REM Verificar que exista el archivo .env
if not exist backend\.env (
    echo ERROR: No existe backend\.env
    echo.
    echo Ejecuta primero: INICIAR_APP.bat
    echo.
    pause
    exit /b 1
)

echo Iniciando Backend en puerto 3001...
start "NODO+ Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Iniciando Frontend en puerto 3000...
start "NODO+ Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   ¡Aplicacion Iniciada!
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Credenciales de prueba:
echo   Email: admin@nodo-plus.com
echo   Password: admin123
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
echo Las aplicaciones continuaran corriendo en sus ventanas.
pause >nul

