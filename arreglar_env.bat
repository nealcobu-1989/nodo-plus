@echo off
echo Configurando archivo .env con password por defecto "postgres"
echo.

(
echo DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nodo_plus?schema=public"
echo JWT_SECRET="mi-clave-secreta-super-segura-cambiar-en-produccion"
echo JWT_EXPIRES_IN="7d"
echo PORT=3001
echo FRONTEND_URL=http://localhost:3000
) > backend\.env

echo Archivo backend\.env creado.
echo.
echo NOTA: Si tu password de PostgreSQL NO es "postgres",
echo edita manualmente backend\.env para cambiarla.
echo.
pause

