@echo off
echo Deteniendo ngrok actual...
taskkill /F /IM ngrok.exe 2>nul

timeout /t 2 /nobreak >nul

echo Iniciando ngrok con host-header...
ngrok http 3000 --host-header="localhost:3000"

