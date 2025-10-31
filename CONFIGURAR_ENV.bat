@echo off
echo ========================================
echo    CONFIGURADOR DE .env para NODO+
echo ========================================
echo.

if exist backend\.env (
    echo Ya existe un archivo backend\.env
    echo.
    choice /C SN /M "¿Deseas sobrescribirlo"
    if errorlevel 2 goto :end
)

echo.
echo Ingresa la contraseña de tu usuario postgres de PostgreSQL:
echo (Por defecto es "postgres")
echo.
set /p PASSWORD="Password (deja vacio para usar 'postgres'): "

if "%PASSWORD%"=="" set PASSWORD=postgres

echo.
echo Creando archivo .env...

(
echo # Database
echo DATABASE_URL="postgresql://postgres:%PASSWORD%@localhost:5432/nodo_plus?schema=public"
echo.
echo # JWT
echo JWT_SECRET="mi-clave-secreta-super-segura-cambiar-en-produccion"
echo JWT_EXPIRES_IN="7d"
echo.
echo # Server
echo PORT=3001
echo FRONTEND_URL=http://localhost:3000
) > backend\.env

echo.
echo ¡Archivo .env creado exitosamente!
echo.
echo IMPORTANTE: Si la contraseña ingresada es incorrecta, edita manualmente
echo backend\.env y cambia la contraseña en DATABASE_URL
echo.

:end
pause

