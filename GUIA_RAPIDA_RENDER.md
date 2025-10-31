# 🚀 Guía Rápida: Desplegar NODO+ en Render

## ✅ Estado Actual
He preparado tu app para ser desplegada. Ahora necesitas:

---

## 📝 PASOS PARA DESPLEGAR

### 1️⃣ **Conectar a GitHub**

#### Instalar Git (si no lo tienes):
- Descarga: https://git-scm.com/download/win
- O usa GitHub Desktop: https://desktop.github.com/

#### Subir tu código:
```bash
cd C:\nodo-plus
git init
git add .
git commit -m "Initial commit - NODO+ ready for Render"
```

#### Crear repositorio en GitHub:
1. Ve a: https://github.com/new
2. Nombre: `nodo-plus`
3. NO marques "Initialize with README"
4. Click "Create repository"

#### Subir código:
```bash
git remote add origin https://github.com/TU_USUARIO/nodo-plus.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ **Crear Base de Datos en Render**

1. Ve a: https://dashboard.render.com
2. "New +" → "PostgreSQL"
3. Configuración:
   - **Name:** `nodo-plus-db`
   - **Database:** `nodo_plus`
   - **Region:** Ohio (o más cercano)
4. Click "Create Database"
5. **COPIAR LA URL** de la base de datos (Internal Database URL)

---

### 3️⃣ **Crear Backend en Render**

1. "New +" → "Web Service"
2. Conecta tu repositorio de GitHub `nodo-plus`
3. Configuración:
   - **Name:** `nodo-plus-backend`
   - **Region:** Mismo que la BD
   - **Branch:** `main`
   - **Root Directory:** `backend` ⚠️ MUY IMPORTANTE
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npm run build && npx prisma migrate deploy && npm run db:seed`
   - **Start Command:** `npm start`

#### Variables de Entorno:
Click en "Advanced" → "Add Environment Variable":

```
DATABASE_URL=<PEGA_LA_URL_DE_LA_BD_AQUI>
JWT_SECRET=cualquier_string_largo_y_secreto_aqui_cambiame
JWT_EXPIRES_IN=7d
PORT=10000
FRONTEND_URL=*
```

4. Click "Create Web Service"

---

### 4️⃣ **Verificar Backend**

Una vez que el build esté completo (10-15 min):

1. Abre los logs del `nodo-plus-backend` en Render
2. Verifica que se ejecutaron migraciones
3. Verifica que se ejecutó el seed (debe decir: "🎉 Seeding completed!")

---

### 5️⃣ **Crear Frontend en Render**

1. "New +" → "Static Site"
2. Conecta repositorio `nodo-plus`
3. Configuración:
   - **Name:** `nodo-plus-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

#### Variables de Entorno:
```
VITE_API_URL=https://nodo-plus-backend.onrender.com
```

⚠️ Reemplaza `nodo-plus-backend` con el nombre real de tu backend.

4. Click "Create Static Site"

---

## 🎉 ¡Listo!

Tu app estará en:
- **Frontend:** `https://nodo-plus-frontend.onrender.com`
- **Backend:** `https://nodo-plus-backend.onrender.com`

---

## 🔍 ¿Problemas?

### Backend no inicia:
- Verifica que Root Directory sea `backend`
- Revisa los logs en Render
- Asegúrate que DATABASE_URL esté correcta

### Frontend no carga:
- Verifica que Root Directory sea `frontend`
- Verifica que VITE_API_URL apunte al backend correcto
- Revisa la consola del navegador

### Base de datos vacía:
- Ejecuta migraciones en Shell: `npx prisma migrate deploy`
- Ejecuta seed: `npx tsx prisma/seed.ts`

---

## 💰 Costos

**Gratis con limitaciones:**
- PostgreSQL: 90 días gratis, luego $7/mes
- Backend: Se duerme después de 15 min sin uso
- Frontend: Siempre gratis

**Para producción:**
- Plan Starter: $7/mes para BD permanente
- Puedes mantenerlo gratis usando solo ngrok para demos

---

## 📞 ¿Necesitas ayuda?

- Render Docs: https://render.com/docs
- Dashoard de Render: https://dashboard.render.com
- Logs en tiempo real: Click en tu servicio → "Logs"

