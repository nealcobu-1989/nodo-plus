# 📋 Instrucciones Completas para Correr NODO+

## ✅ Lo que Ya Tienes

- ✅ Node.js instalado
- ✅ PostgreSQL instalado (según mencionaste)
- ✅ Dependencias de backend instaladas
- ✅ Dependencias de frontend instaladas

## ❌ Lo que Necesitas Hacer

### Paso 1: Descubrir tu Contraseña de PostgreSQL

**IMPORTANTE**: Necesitas la contraseña del usuario "postgres" de tu PostgreSQL.

Si no la recuerdas, tienes varias opciones:

#### Opción A: Buscar en archivos
- Revisa si guardaste la contraseña durante la instalación
- Busca en documentos o notas

#### Opción B: Cambiar la contraseña
1. Busca en el menú de inicio de Windows: **SQL Shell (psql)**
2. Abre SQL Shell
3. Presiona Enter para todas las opciones (usa valores por defecto)
4. Cuando pregunte por la contraseña, déjala vacía o prueba con "postgres"
5. Una vez conectado, escribe:
   ```sql
   ALTER USER postgres WITH PASSWORD 'postgres';
   ```

#### Opción C: Usar pgAdmin
1. Busca **pgAdmin 4** en el menú de inicio
2. Abre pgAdmin
3. Si te pide contraseña, usa la que recuerdes
4. Una vez dentro, puedes cambiar la contraseña del usuario postgres

### Paso 2: Configurar el archivo .env

Abre el archivo `backend\.env` con el Bloc de Notas y edita la línea:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nodo_plus?schema=public"
```

Cambia **postgres** (después de los dos puntos) por tu contraseña real.

Ejemplo si tu password es "mipassword123":
```
DATABASE_URL="postgresql://postgres:mipassword123@localhost:5432/nodo_plus?schema=public"
```

### Paso 3: Crear la Base de Datos

Desde SQL Shell (psql) o pgAdmin, ejecuta:

```sql
CREATE DATABASE nodo_plus;
```

O si estás en la terminal de psql:
```bash
createdb -U postgres nodo_plus
```

### Paso 4: Configurar Prisma

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

Si todo sale bien, verás:
```
✅ Admin user created: admin@nodo-plus.com
✅ Created XX catalog items
✅ Created traffic light rules
🎉 Seeding completed!
```

### Paso 5: Correr la Aplicación

Abre **DOS terminales**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Deberías ver:
```
🚀 Server running on port 3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Deberías ver algo como:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
```

### Paso 6: Abrir en Navegador

Abre tu navegador en: **http://localhost:3000**

### Paso 7: Hacer Login

Usa estas credenciales:
- **Email**: admin@nodo-plus.com
- **Password**: admin123

---

## 🎯 Scripts Rápidos

También puedes usar estos scripts (después de arreglar la contraseña en .env):

### Script de Configuración Única
```bash
INICIAR_APP.bat
```
Instala dependencias y configura la base de datos.

### Script para Correr la App
```bash
CORRER_APP.bat
```
Inicia ambos servidores automáticamente.

---

## 🐛 Problemas Comunes

### Error: "Authentication failed"

**Solución**: La contraseña en `backend\.env` es incorrecta. Edítala.

### Error: "database nodo_plus does not exist"

**Solución**: Crea la base de datos:
```sql
CREATE DATABASE nodo_plus;
```

### Error: "Cannot find module"

**Solución**:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Error: "psql: command not found"

**Solución**: PostgreSQL no está en el PATH. Usa SQL Shell desde el menú de inicio en su lugar.

---

## ✅ Checklist Final

Antes de correr la app, verifica:

- [ ] Contraseña de PostgreSQL identificada
- [ ] Archivo `backend\.env` configurado correctamente
- [ ] Base de datos `nodo_plus` creada
- [ ] `npm run db:migrate` ejecutado exitosamente
- [ ] `npm run db:seed` ejecutado exitosamente
- [ ] Backend corriendo en http://localhost:3001
- [ ] Frontend corriendo en http://localhost:3000

---

## 📞 ¿Necesitas Ayuda?

Si sigues teniendo problemas:
1. Lee el archivo `PROBLEMA_Y_SOLUCION.md` para más detalles
2. Verifica que PostgreSQL esté instalado y corriendo
3. Asegúrate de tener permisos de administrador si es necesario

