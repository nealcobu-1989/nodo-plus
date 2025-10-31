# 🚀 Cómo Correr NODO+ Paso a Paso

## Problema Actual

Tu archivo `backend\.env` tiene una contraseña incorrecta de PostgreSQL.

## Solución Rápida

### Opción 1: Editar Manualmente (MÁS RÁPIDO)

1. Abre el archivo `backend\.env` con un editor de texto
2. Busca la línea que dice:
   ```
   DATABASE_URL="postgresql://postgres:???@localhost:5432/nodo_plus?schema=public"
   ```
3. Cambia `???` por tu contraseña de PostgreSQL (generalmente es `postgres`)
4. Guarda el archivo

### Opción 2: Usar PowerShell

Abre PowerShell y ejecuta:

```powershell
# Si tu password es "postgres"
@"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nodo_plus?schema=public"
JWT_SECRET="mi-clave-secreta-super-segura-cambiar-en-produccion"
JWT_EXPIRES_IN="7d"
PORT=3001
FRONTEND_URL=http://localhost:3000
"@ | Out-File -FilePath backend\.env -Encoding utf8
```

## Verificar que la Base de Datos Existe

```bash
psql -U postgres -l
```

Deberías ver `nodo_plus` en la lista. Si NO existe, créala:

```bash
createdb -U postgres nodo_plus
```

O desde psql:

```bash
psql -U postgres
CREATE DATABASE nodo_plus;
\q
```

## Ahora Correr la App

### 1. Configurar Base de Datos

```bash
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 2. Iniciar Servidores

Abre **DOS terminales**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 3. Abrir en Navegador

Abre: **http://localhost:3000**

**Login:**
- Email: `admin@nodo-plus.com`
- Password: `admin123`

---

## Scripts Disponibles

También puedes usar estos scripts (después de arreglar el .env):

- `INICIAR_APP.bat` - Configura todo automáticamente
- `CORRER_APP.bat` - Inicia ambos servidores en ventanas separadas

---

## ¿Necesitas Ayuda?

Si aún tienes problemas, verifica:
1. ✅ PostgreSQL está instalado y corriendo
2. ✅ La contraseña en `.env` es correcta
3. ✅ La base de datos `nodo_plus` existe
4. ✅ Ejecutaste `npm install` en backend y frontend

