@echo off
echo ========================================
echo    CONFIGURACION RAPIDA NODO+
echo ========================================
echo.

echo [1/6] Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    pause
    exit /b 1
)
echo OK
echo.

echo [2/6] Verificando PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ADVERTENCIA: PostgreSQL no encontrado en PATH
    echo Asegurate de tener PostgreSQL instalado
)
echo.

echo [3/6] Configurando Backend...
cd backend
if not exist node_modules (
    echo Instalando dependencias del backend...
    call npm install
)

if not exist .env (
    echo Creando archivo .env...
    copy .env.example .env
    echo.
    echo IMPORTANTE: Edita backend\.env con tus credenciales de PostgreSQL
    echo DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/nodo_plus?schema=public"
    echo JWT_SECRET="mi-clave-secreta-123"
    echo.
    pause
)

cd ..
echo.

echo [4/6] Configurando Base de Datos...
cd backend
echo Ejecutando: npm run db:generate
call npm run db:generate
echo.
echo Ejecutando: npm run db:migrate
call npm run db:migrate
echo.
echo Ejecutando: npm run db:seed
call npm run db:seed
cd ..
echo.

echo [5/6] Configurando Frontend...
cd frontend
if not exist node_modules (
    echo Instalando dependencias del frontend...
    call npm install
)
cd ..
echo.

echo [6/6] ¡Listo!
echo.
echo ========================================
echo    PROXIMOS PASOS:
echo ========================================
echo.
echo 1. Abre DOS terminales:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo 2. Abre tu navegador en: http://localhost:3000
echo.
echo 3. Credenciales de prueba:
echo    Email: admin@nodo-plus.com
echo    Password: admin123
echo.
echo ========================================
pause

