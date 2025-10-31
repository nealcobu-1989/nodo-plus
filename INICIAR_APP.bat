@echo off
echo ========================================
echo    INICIANDO NODO+ PLATAFORMA EDTECH
echo ========================================
echo.

REM Verificar que exista el archivo .env
if not exist backend\.env (
    echo ERROR: No existe backend\.env
    echo.
    echo Por favor crea el archivo backend\.env con el siguiente contenido:
    echo.
    echo DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/nodo_plus?schema=public"
    echo JWT_SECRET="mi-clave-secreta-super-segura-cambiar-en-produccion"
    echo JWT_EXPIRES_IN="7d"
    echo PORT=3001
    echo FRONTEND_URL=http://localhost:3000
    echo.
    echo Reemplaza TU_PASSWORD con tu password de PostgreSQL
    echo.
    pause
    exit /b 1
)

REM Verificar que exista la base de datos
echo Verificando conexion a PostgreSQL...
cd backend
call npm run db:generate >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: No se pudo conectar a PostgreSQL
    echo.
    echo Por favor:
    echo 1. Asegurate de que PostgreSQL este instalado y corriendo
    echo 2. Verifica tu DATABASE_URL en backend\.env
    echo 3. Crea la base de datos con: createdb -U postgres nodo_plus
    echo.
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo   PASO 1: Configurando Base de Datos
echo ========================================
echo.

cd backend
echo Ejecutando migraciones de base de datos...
call npm run db:migrate
if %errorlevel% neq 0 (
    echo Error ejecutando migraciones
    cd ..
    pause
    exit /b 1
)

echo.
echo Ejecutando seed de datos iniciales...
call npm run db:seed
if %errorlevel% neq 0 (
    echo Error ejecutando seed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo   PASO 2: Instalando Dependencias
echo ========================================
echo.

cd backend
if not exist node_modules (
    echo Instalando dependencias del backend...
    call npm install
)
cd ..

cd frontend
if not exist node_modules (
    echo Instalando dependencias del frontend...
    call npm install
)
cd ..

echo.
echo ========================================
echo   ¡Configuracion Completa!
echo ========================================
echo.
echo Ahora abre DOS terminales y ejecuta:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Luego abre: http://localhost:3000
echo.
echo Credenciales de prueba:
echo   Email: admin@nodo-plus.com
echo   Password: admin123
echo.
pause

