# 🚀 Iniciar App con Acceso Externo (ngrok)

## Pasos Rápidos:

### 1. Instalar ngrok

**Opción A: Descarga Manual**
1. Ve a: https://ngrok.com/download
2. Descarga para Windows
3. Descomprime `ngrok.exe` en una carpeta (ej: `C:\ngrok\`)
4. Agrega esa carpeta al PATH de Windows, O ejecuta desde esa carpeta

**Opción B: Con Chocolatey (si lo tienes instalado)**
```powershell
choco install ngrok
```

**Opción C: Con Scoop (si lo tienes instalado)**
```powershell
scoop install ngrok
```

### 2. Registrarse en ngrok (GRATIS)

1. Ve a: https://dashboard.ngrok.com/signup
2. Crea una cuenta (puedes usar GitHub o Google)
3. Copia tu token de autenticación

### 3. Autenticar ngrok

```bash
ngrok config add-authtoken TU_TOKEN_AQUI
```

### 4. Iniciar la aplicación normal

**Terminal 1 - Backend:**
```bash
cd C:\nodo-plus\backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd C:\nodo-plus\frontend
npm run dev
```

### 5. Exponer con ngrok

**Terminal 3 - ngrok:**
```bash
ngrok http 3000
```

ngrok mostrará algo como:
```
Forwarding    https://abc123def456.ngrok.io -> http://localhost:3000
```

### 6. Compartir la URL

Comparte la URL `https://abc123def456.ngrok.io` con quien quieras que pruebe la app.

---

## ⚠️ Notas Importantes:

1. **La URL cambia cada vez** que reinicias ngrok (en plan gratuito)
   - Solución: Plan de pago ($8/mes) para URL fija

2. **Backend en localhost:3001**
   - ngrok solo expone el puerto 3000 (frontend)
   - El frontend hace peticiones al backend en localhost:3001
   - Para acceso externo, el frontend necesita poder alcanzar el backend
   - **Solución:** También expone el backend con otro ngrok:
     ```bash
     # Terminal 4
     ngrok http 3001
     ```
     Luego actualiza `FRONTEND_URL` o la configuración del frontend

3. **Mantén las terminales abiertas** mientras quieras que funcione

---

## 🔧 Configuración Avanzada (si necesitas ambos)

Si quieres que funcione completamente desde fuera:

1. **Exponer backend también:**
   ```bash
   ngrok http 3001
   ```
   Copia la URL del backend (ej: `https://xyz789.ngrok.io`)

2. **Actualizar frontend para usar la URL pública del backend:**
   
   Edita `frontend/vite.config.ts` y cambia el proxy:
   ```typescript
   proxy: {
     '/api': {
       target: 'https://xyz789.ngrok.io', // URL pública del backend
       changeOrigin: true,
       secure: true
     }
 головы}
   ```

   O crea un archivo `.env` en frontend:
   ```
   VITE_API_URL=https://xyz789.ngrok.io
   ```

---

## 📱 Alternativa Más Simple: localtunnel

Si ngrok te parece complicado:

```bash
# Instalar
npm install -g localtunnel

# Exponer frontend
lt --port 3000

# Exponer backend (otra terminal)
lt --port 3001
```

Pero necesitarás configurar el frontend igual que con ngrok.

