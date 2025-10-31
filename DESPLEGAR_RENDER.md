# 🚀 Desplegar NODO+ en Render.com

Esta guía te llevará paso a paso para conectar tu app a GitHub y desplegarla en Render para que esté **live online permanente**.

---

## 📋 Pre-requisitos

1. ✅ Tener cuenta en GitHub.com (gratis)
2. ✅ Tener cuenta en Render.com (gratis)
3. ✅ Tener Git instalado (o usar GitHub Desktop)
4. ✅ Tu aplicación funcionando localmente

---

## PASO 1: Preparar el Repositorio Local

### 1.1 Inicializar Git (si no está inicializado)

```bash
git init
```

### 1.2 Verificar archivos sensibles

Asegúrate de que `.gitignore` está en la raíz del proyecto y contiene:

```
node_modules/
.env
.env.local
.env.*.local
*.log
.DS_Store
dist/
build/
```

### 1.3 Agregar todos los archivos

```bash
git add .
git commit -m "Initial commit - NODO+ application"
```

---

## PASO 2: Crear Repositorio en GitHub

### 2.1 Crear nuevo repositorio

1. Ve a: https://github.com/new
2. **Repository name:** `nodo-plus` (o el que prefieras)
3. **Description:** Plataforma para conectar instituciones educativas con soluciones EdTech
4. **Visibility:** Público o Privado (tu elección)
5. ❌ **NO marques** "Initialize with README"
6. Click en **"Create repository"**

### 2.2 Conectar repositorio local con GitHub

GitHub te dará comandos. Ejecuta estos (reemplaza `TU_USUARIO` con tu username):

```bash
# Si tu repo se llama 'nodo-plus'
git remote add origin https://github.com/TU_USUARIO/nodo-plus.git
git branch -M main
git push -u origin main
```

---

## PASO 3: Configurar Backend en Render

### 3.1 Crear nuevo servicio de Base de Datos PostgreSQL

1. Ve a: https://dashboard.render.com
2. Click en **"New +"** → **"PostgreSQL"**
3. Configuración:
   - **Name:** `nodo-plus-db`
   - **Region:** Selecciona el más cercano a tus usuarios (ej: "Ohio" para Latam)
   - **PostgreSQL Version:** 18
   - **Database:** `nodo_plus`
   - Click **"Create Database"**

### 3.2 Copiar la Base de Datos URL

Render te dará algo como:
```
postgresql://usuario:password@dpg-xxxxx-a.oregon-postgres.render.com/nodo_plus
```

**IMPORTANTE:** Copia esta URL completa, la necesitarás.

### 3.3 Crear servicio de Web Service para Backend

1. En Render, click **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub:
   - Click **"Connect account"** si es tu primera vez
   - Selecciona tu repositorio `nodo-plus`
3. Configuración:
   - **Name:** `nodo-plus-backend`
   - **Region:** Mismo que la BD
   - **Branch:** `main`
   - **Root Directory:** `backend` ⚠️ IMPORTANTE
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`

### 3.4 Variables de Entorno del Backend

Click en **"Advanced"** → **"Add Environment Variable"** y agrega:

```
DATABASE_URL=postgresql://usuario:password@dpg-xxxxx-a.oregon-postgres.render.com/nodo_plus
JWT_SECRET=tu_secret_super_secreto_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=7d
PORT=10000
FRONTEND_URL=https://nodo-plus-frontend.onrender.com
```

**⚠️ IMPORTANTE:** 
- Pega la URL completa de tu base de datos PostgreSQL
- Cambia `JWT_SECRET` por algo aleatorio y seguro (puede ser cualquier string largo)

### 3.5 Configurar el Backend para Render

Render requiere escuchar en el puerto que la variable `PORT` defina. Actualiza `backend/src/index.ts`:

```typescript
const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 3.6 Crear servicio de Backend

Click **"Create Web Service"**. Render comenzará a construir tu backend.

---

## PASO 4: Preparar Base de Datos en Render

### 4.1 Ejecutar Migraciones

Una vez que el backend esté levantado (toma ~5-10 minutos), necesitas correr las migraciones:

1. Ve al dashboard de Render
2. Abre tu servicio `nodo-plus-backend`
3. Click en **"Shell"**
4. Ejecuta:
```bash
npm run db:migrate
npm run db:seed
```

---

## PASO 5: Configurar Frontend en Render

### 5.1 Crear servicio de Static Site

1. En Render, click **"New +"** → **"Static Site"**
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Name:** `nodo-plus-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

### 5.2 Variables de Entorno del Frontend

En **"Advanced"** → **"Environment Variables"**:

```
VITE_API_URL=https://nodo-plus-backend.onrender.com
```

**⚠️ IMPORTANTE:** Reemplaza `nodo-plus-backend` con el nombre real de tu backend en Render.

### 5.3 Configurar Frontend para Render

Necesitas actualizar el proxy o la configuración de API en `frontend/vite.config.ts` para producción:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    // ... configuración existente
  },
  // Agregar para producción
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
  }
})
```

Y en `frontend/src` crear un archivo de configuración de API:

```typescript
// src/config/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'https://nodo-plus-backend.onrender.com';

export const apiConfig = {
  baseURL: API_URL
};
```

---

## PASO 6: Actualizar Backend para Aceptar CORS

Render te dará URLs HTTPS. Asegúrate que tu backend acepta requests del frontend:

En `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

---

## PASO 7: Desplegar

### 7.1 Push tus cambios

```bash
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

### 7.2 Render desplegará automáticamente

Render detectará los cambios en GitHub y comenzará a desplegar.

---

## 🎉 ¡Listo!

Tu aplicación estará disponible en:
- **Frontend:** `https://nodo-plus-frontend.onrender.com`
- **Backend:** `https://nodo-plus-backend.onrender.com`

---

## 📚 Archivos Importantes para el Deployment

### backend/src/index.ts (ejemplo completo):

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json());

// ... tus rutas

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### backend/package.json (scripts importantes):

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:migrate": "prisma migrate deploy",
    "db:generate": "prisma generate",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

---

## 🔧 Troubleshooting

### Backend no inicia:
- Verifica que `PORT` esté definido en variables de entorno
- Verifica que `DATABASE_URL` sea correcta
- Revisa los logs en Render → "Logs"

### Frontend no se conecta al backend:
- Verifica que `VITE_API_URL` apunte a la URL correcta del backend
- Verifica que CORS esté configurado correctamente
- Revisa la consola del navegador para errores

### Migraciones fallan:
- Ejecuta en Shell de Render: `npm run db:migrate`
- Verifica que la base de datos esté accesible
- Revisa logs para errores específicos

---

## 💰 Costos

**Gratis (con limitaciones):**
- PostgreSQL: 90 días gratis, luego $7/mes
- Web Services: Se "duermen" después de 15 min de inactividad (plan gratis)
- Static Sites: Siempre gratis

**Para producción real:**
- Considera el plan de pago ($25/mes) para mantener servicios siempre activos

---

## 🎯 Próximos Pasos

1. Configurar dominio personalizado (opcional)
2. Configurar SSL (automático en Render)
3. Monitoreo y logs
4. CI/CD con GitHub Actions

---

**¡Tu app estará live! 🚀**

