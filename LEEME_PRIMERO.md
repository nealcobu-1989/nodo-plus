# 👋 ¡Bienvenido a NODO+!

## 🎯 Pasos para Correr la Aplicación

Ya tienes Node.js y PostgreSQL instalados. Ahora necesitas seguir estos pasos:

### Paso 1: Configurar el archivo .env (IMPORTANTE)

Ejecuta en una terminal:

```bash
CONFIGURAR_ENV.bat
```

Este script te pedirá la contraseña de PostgreSQL y creará el archivo `backend/.env`.

**Si tu contraseña de PostgreSQL NO es "postgres"**, después de ejecutar el script, edita manualmente el archivo `backend\.env` y cambia la contraseña en la línea de `DATABASE_URL`.

### Paso 2: Crear la Base de Datos

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

### Paso 3: Configurar la Aplicación

```bash
INICIAR_APP.bat
```

Este script instalará dependencias, configurará la base de datos y creará datos iniciales.

### Paso 4: Correr la Aplicación

```bash
CORRER_APP.bat
```

Este script abrirá DOS ventanas:
- **Backend**: http://localhost:3001  
- **Frontend**: http://localhost:3000

### Paso 5: Abrir en el Navegador

Abre: **http://localhost:3000**

**Credenciales de prueba:**
- Email: `admin@nodo-plus.com`
- Password: `admin123`

---

## 🔧 Si Algo Sale Mal

### Error: "Authentication failed"

La contraseña de PostgreSQL en `backend\.env` es incorrecta. Edita el archivo y corrígela.

### Error: "database nodo_plus does not exist"

Ejecuta:
```bash
createdb -U postgres nodo_plus
```

### Error: "Cannot find module"

Ejecuta:
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## 📚 Más Información

- `INSTRUCCIONES_INICIO.md` - Guía detallada
- `QUICK_START.md` - Guía rápida completa
- `SETUP.md` - Configuración avanzada

