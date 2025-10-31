# ✅ Checklist para Render Deployment

## PASO 2: Crear Base de Datos ✅ / ❌

- [ ] Ir a https://dashboard.render.com
- [ ] "New +" → "PostgreSQL"
- [ ] Configurar:
  - Name: `nodo-plus-db`
  - Database: `nodo_plus`
  - Region: Ohio (o más cercano)
- [ ] Click "Create Database"
- [ ] **COPIAR LA URL** de la base de datos (Internal Database URL)
- [ ] Guardar la URL en algún lugar

---

## PASO 3: Crear Backend ✅ / ❌

- [ ] Ir a Render dashboard
- [ ] "New +" → "Web Service"
- [ ] Conectar con GitHub `nodo-plus`
- [ ] Configurar:
  - Name: `nodo-plus-backend`
  - Region: Mismo que la BD
  - Branch: `main`
  - Root Directory: `backend` ⚠️
  - Runtime: `Node`
  - Build Command: `npm install && npx prisma generate && npm run build`
  - Start Command: `npm start`
- [ ] Click "Advanced" → Agregar variables:
  - `DATABASE_URL` = (pegar URL de la BD)
  - `JWT_SECRET` = cualquiera_string_largo_secreto
  - `JWT_EXPIRES_IN` = 7d
  - `PORT` = 10000
  - `FRONTEND_URL` = *
- [ ] Click "Create Web Service"
- [ ] Esperar 5-10 minutos a que termine el build

---

## PASO 4: Ejecutar Migraciones ✅ / ❌

- [ ] Abrir `nodo-plus-backend` en Render
- [ ] Click "Shell"
- [ ] Ejecutar: `npx prisma migrate deploy`
- [ ] Ejecutar: `npx tsx prisma/seed.ts`
- [ ] Verificar que no haya errores

---

## PASO 5: Crear Frontend ✅ / ❌

- [ ] Ir a Render dashboard
- [ ] "New +" → "Static Site"
- [ ] Conectar repositorio `nodo-plus`
- [ ] Configurar:
  - Name: `nodo-plus-frontend`
  - Branch: `main`
  - Root Directory: `frontend` ⚠️
  - Build Command: `npm install && npm run build`
  - Publish Directory: `dist`
- [ ] Click "Advanced" → Agregar variable:
  - `VITE_API_URL` = https://nodo-plus-backend.onrender.com
  - ⚠️ Usar el nombre REAL de tu backend
- [ ] Click "Create Static Site"
- [ ] Esperar build completo

---

## PASO 6: Verificar ✅ / ❌

- [ ] Frontend esté deployado
- [ ] Backend esté deployado
- [ ] Abrir URL del frontend en el navegador
- [ ] Probar login con credenciales de admin
- [ ] Ver catálogo de soluciones EdTech
- [ ] Ver listado de instituciones educativas

---

## 🎉 ¡LISTO!

Tu app estará live en:
- Frontend: https://nodo-plus-frontend.onrender.com
- Backend: https://nodo-plus-backend.onrender.com

