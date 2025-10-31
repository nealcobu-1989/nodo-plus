@echo off
echo ========================================
echo   Subir NODO+ a GitHub
echo ========================================
echo.

echo Asegurandose de estar en el directorio correcto...
cd /d %~dp0
echo Directorio actual: %CD%
echo.
pause

echo.
echo Configurando Git (solo primera vez)...
echo.
set /p GIT_USER_NAME="Ingresa tu nombre: "
set /p GIT_USER_EMAIL="Ingresa tu email: "

git config --global user.name "%GIT_USER_NAME%"
git config --global user.email "%GIT_USER_EMAIL%"
echo.

echo Inicializando Git...
git init
echo.

echo Agregando archivos...
git add .
echo.

echo Haciendo commit...
git commit -m "Initial commit - NODO+ ready for Render"
echo.

echo.
echo ========================================
echo   PASO INTERMEDIO NECESARIO
echo ========================================
echo.
echo Ahora necesitas:
echo.
echo 1. Ir a: https://github.com/new
echo 2. Crear un repositorio llamado "nodo-plus"
echo 3. NO marcar "Initialize with README"
echo 4. Click "Create repository"
echo.
echo Luego ejecuta estos comandos en Git Bash:
echo.
echo   cd /c/nodo-plus
echo   git remote add origin https://github.com/TU_USUARIO/nodo-plus.git
echo   git branch -M main
echo   git push -u origin main
echo.
echo (Reemplaza TU_USUARIO con tu username de GitHub)
echo.
echo O usa el archivo COMANDOS_GIT.md para ver los pasos detallados
echo.
echo ========================================
echo.
pause

