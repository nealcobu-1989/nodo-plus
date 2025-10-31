@echo off
echo ========================================
echo   Iniciando ngrok para NODO+
echo ========================================
echo.
echo Este script expone tu aplicacion local a internet.
echo Los servidores de backend y frontend deben estar corriendo primero.
echo.
echo Presiona cualquier tecla para continuar o Ctrl+C para cancelar...
pause >nul

echo.
echo [1/3] Verificando que ngrok este instalado...
ngrok version >nul 2>&1
if errorlevel 1 (
    echo ERROR: ngrok no esta instalado
    echo.
    echo Descarga ngrok desde: https://ngrok.com/download
    echo O instala con: choco install ngrok
    echo.
    pause
    exit /b 1
)

echo ngrok encontrado! ✓
echo.

echo [2/3] Deteniendo cualquier instancia anterior de ngrok...
taskkill /F /IM ngrok.exe >nul 2>&1

timeout /t 2 /nobreak >nul

echo [3/3] Iniciando ngrok en puerto 3000 (Frontend)...
echo.
echo ========================================
echo   ngrok corriendo!
echo ========================================
echo.
echo La aplicacion estara disponible en la URL que ngrok proporcione.
echo Puedes ver el dashboard de ngrok en: http://localhost:4040
echo.
echo Presiona Ctrl+C para detener ngrok
echo ========================================
echo.

ngrok http 3000 --host-header="localhost:3000"

