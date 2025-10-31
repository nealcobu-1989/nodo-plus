# 🚀 Instrucciones de Inicio Rápido - NODO+

## Paso 1: Crear el archivo .env

Ve a la carpeta `backend` y crea un archivo llamado `.env` con el siguiente contenido:

```env
# Database
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/nodo_plus?schema=public"

# JWT
JWT_SECRET="mi-clave-secreta-super-segura-cambiar-en-produccion"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**IMPORTANTE**: Reemplaza `TU_PASSWORD` con la contraseña que configuraste para PostgreSQL.

## Paso 2: Crear la Base de Datos

Abre una terminal y ejecuta:

```bash
createdb -U postgres nodo_plus
```

O desde psql:

```bash
psql -U postgres
CREATE DATABASE nodo_plus;
\q
```

## Paso 3: Configurar la Aplicación

Ejecuta el script de configuración:

```bash
INICIAR_APP.bat
```

Este script hará:
- ✅ Instalar dependencias del backend
- ✅ Generar cliente Prisma
- ✅ Ejecutar migraciones de base de datos
- ✅ Poblar con datos iniciales (seed)
- ✅ Instalar dependencias del frontend

## Paso 4: Correr la Aplicación

Ejecuta el script de inicio:

```bash
CORRER_APP.bat
```

Este script abrirá DOS ventanas:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000

## Acceso a la Aplicación

Abre tu navegador en: **http://localhost:3000**

### Credenciales de Prueba

- **Email**: admin@nodo-plus.com
- **Password**: admin123

## Alternativa: Ejecutar Manualmente

Si prefieres ejecutar manualmente, abre DOS terminales:

### Terminal 1 - Backend

```bash
cd backend
npm install          # Solo la primera vez
npm run db:generate  # Solo la primera vez
npm run db:migrate   # Solo la primera vez
npm run db:seed      # Solo la primera vez
npm run dev
```

### Terminal 2 - Frontend

```bash
cd frontend
npm install  # Solo la primera vez
npm run dev
```

## 🐛 Solución de Problemas

### Error: No se puede conectar a PostgreSQL

1. Verifica que PostgreSQL esté instalado y corriendo
2. Verifica la contraseña en `backend/.env`
3. Verifica que la base de datos exista:

```bash
psql -U postgres -l
```

### Error: Puerto ocupado

Si el puerto 3000 o 3001 está ocupado, puedes cambiarlos:

- Backend: Edita `backend/.env` y cambia `PORT=3001`
- Frontend: Edita `frontend/vite.config.ts`

### Error: Módulos no encontrados

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📚 Más Información

Para más detalles, consulta:
- `QUICK_START.md` - Guía rápida completa
- `SETUP.md` - Guía de configuración detallada
- `README.md` - Información general del proyecto

