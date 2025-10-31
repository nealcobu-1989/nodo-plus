# 🚀 Guía Rápida para Probar NODO+

## Paso 1: Verificar Requisitos

Asegúrate de tener instalado:
- ✅ Node.js 18+ (verificar con: `node --version`)
- ✅ PostgreSQL (verificar con: `psql --version`)
- ✅ npm (verificar con: `npm --version`)

## Paso 2: Crear Base de Datos PostgreSQL

```bash
# Opción 1: Desde psql
psql -U postgres
CREATE DATABASE nodo_plus;
\q

# Opción 2: Desde línea de comandos
createdb -U postgres nodo_plus
```

## Paso 3: Configurar Backend

```bash
# 1. Ir a la carpeta backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
copy .env.example .env    # Windows
# O en Mac/Linux: cp .env.example .env

# 4. Editar .env con tus credenciales de PostgreSQL
# DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/nodo_plus?schema=public"
# JWT_SECRET="mi-clave-secreta-123"
```

## Paso 4: Configurar Base de Datos

```bash
# Desde la carpeta backend
npm run db:generate    # Generar cliente Prisma
npm run db:migrate     # Crear tablas en la BD
npm run db:seed        # Poblar con datos iniciales
```

## Paso 5: Iniciar Backend

```bash
# Desde la carpeta backend
npm run dev
```

Deberías ver: `🚀 Server running on port 3001`

## Paso 6: Configurar Frontend

Abre **otra terminal** y ejecuta:

```bash
# 1. Ir a la carpeta frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

Deberías ver algo como: `Local: http://localhost:3000`

## Paso 7: Probar la Aplicación

1. Abre tu navegador en: **http://localhost:3000**
2. Deberías ver el landing page con el logo N+ y los colores azules
3. Puedes hacer clic en "Iniciar sesión" para probar el login

### Credenciales de Prueba

- **Email**: admin@nodo-plus.com
- **Contraseña**: admin123

## 🔧 Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté corriendo
- Revisa la URL en el archivo `.env`
- Verifica que la base de datos `nodo_plus` exista

### Error en Prisma
```bash
# Regenerar cliente
npm run db:generate
```

### Puerto ocupado
- Backend usa puerto 3001, frontend usa 3000
- Si están ocupados, cambia los puertos en `.env` (backend) y `vite.config.ts` (frontend)

## ✅ Checklist de Verificación

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `nodo_plus` creada
- [ ] Backend `.env` configurado
- [ ] `npm install` ejecutado en backend
- [ ] `npm run db:generate` ejecutado
- [ ] `npm run db:migrate` ejecutado
- [ ] `npm run db:seed` ejecutado
- [ ] Backend corriendo en puerto 3001
- [ ] `npm install` ejecutado en frontend
- [ ] Frontend corriendo en puerto 3000
- [ ] Landing page visible en navegador

## 🎯 Próximos Pasos

Una vez que todo esté funcionando:
1. Explora el landing page
2. Prueba hacer login con las credenciales de admin
3. Revisa la estructura del proyecto
4. ¡Comienza a desarrollar nuevas funcionalidades!

