# ⚠️ Problema Detectado

## El Problema

Tu PostgreSQL no tiene la contraseña por defecto "postgres", o PostgreSQL no está configurado en el PATH de Windows.

## Soluciones

### Opción 1: Descubrir tu Contraseña de PostgreSQL

Tienes dos opciones:

**A. Si instalaste PostgreSQL recientemente:**
- La contraseña que elegiste durante la instalación
- Si no recuerdas, intenta dejar la contraseña vacía (solo username postgres)

**B. Buscar la contraseña guardada:**
- Revisa archivos de instalación de PostgreSQL
- Busca en la carpeta donde instalaste PostgreSQL

### Opción 2: Cambiar la Contraseña de PostgreSQL

Si tienes acceso a PostgreSQL, puedes cambiar la contraseña:

1. Busca "SQL Shell (psql)" en el menú de inicio de Windows
2. Ejecuta psql
3. Ingresa:
   - Servidor: localhost
   - Puerto: 5432
   - Usuario: postgres
   - Contraseña: (deja vacío o usa la que recuerdas)
   - Database: postgres

4. Cuando conectes, ejecuta:
   ```sql
   ALTER USER postgres PASSWORD 'postgres';
   ```

### Opción 3: Editar archivo .env Manualmente

1. Abre `backend\.env` con el Bloc de notas o cualquier editor
2. Busca la línea de `DATABASE_URL`
3. Cambia la contraseña después de `postgres:` y antes de `@`
4. Guarda el archivo

Ejemplo:
```env
DATABASE_URL="postgresql://postgres:TU_CONTRASENA_AQUI@localhost:5432/nodo_plus?schema=public"
```

### Opción 4: Sin Contraseña (Si PostgreSQL lo permite)

Si tu PostgreSQL no tiene contraseña, prueba:
```env
DATABASE_URL="postgresql://postgres@localhost:5432/nodo_plus?schema=public"
```

---

## Después de Arreglar la Contraseña

Ejecuta estos comandos:

```bash
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

Si `db:migrate` dice que la base de datos no existe, créala:

```bash
cd backend
npm run db:migrate -- --create-only
```

O manualmente desde SQL Shell:

```sql
CREATE DATABASE nodo_plus;
```

---

## Una Vez Funcionando

Corre la aplicación en DOS terminales:

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

Luego abre: **http://localhost:3000**

---

## ¿Necesitas Más Ayuda?

1. Verifica que PostgreSQL esté instalado: Busca "PostgreSQL" en el menú de inicio
2. Verifica que PostgreSQL esté corriendo: Busca en el Administrador de Tareas un proceso "postgres"
3. Si todo falla, reinstala PostgreSQL y recuerda anotar la contraseña que eliges

