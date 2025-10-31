# ⚠️ IMPORTANTE: Pasos para Subir a GitHub

## El Error que Cometiste

Iniciaste Git desde `C:\Users\ContrerasOsorio` en lugar de `C:\nodo-plus`. Ya lo arreglé eliminando el `.git` incorrecto.

---

## ✅ Haz Esto AHORA:

### OPCIÓN 1: Script Automático (MÁS FÁCIL)

1. **Ejecuta:** `subir_a_github.bat`
2. Sigue las instrucciones
3. Te pedirá crear el repo en GitHub
4. Ejecuta los últimos comandos en Git Bash

---

### OPCIÓN 2: Manual (Git Bash)

#### 1. Abre Git Bash en la carpeta del proyecto

**IMPORTANTE:** Haz click derecho en `C:\nodo-plus` en el explorador de Windows y selecciona **"Git Bash Here"**.

#### 2. Verifica que estás en el lugar correcto

```bash
pwd
```

**Debe mostrar:** `/c/nodo-plus`

Si muestra otra cosa:
```bash
cd /c/nodo-plus
```

#### 3. Configura Git (solo una vez en tu vida)

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

Ejemplo:
```bash
git config --global user.name "Juan Contreras"
git config --global user.email "juan@example.com"
```

#### 4. Inicializa Git

```bash
git init
```

#### 5. Agrega archivos

```bash
git add .
```

#### 6. Haz commit

```bash
git commit -m "Initial commit - NODO+ ready for Render"
```

---

## Ahora Conecta con GitHub:

### PASO A: Crear Repositorio en GitHub

1. Ve a: https://github.com/new
2. **Repository name:** `nodo-plus`
3. ❌ **NO marques** "Initialize with README"
4. Click **"Create repository"**

---

### PASO B: Subir tu código

GitHub te dará comandos. Ejecuta estos en Git Bash:

```bash
git remote add origin https://github.com/TU_USUARIO/nodo-plus.git
git branch -M main
git push -u origin main
```

**⚠️ MUY IMPORTANTE:**
- Reemplaza `TU_USUARIO` con tu username real de GitHub
- Te pedirá username y password
- Si tienes 2FA, usa un token en lugar de password

---

## ✅ Verifica:

Ve a: https://github.com/TU_USUARIO/nodo-plus

Deberías ver todos tus archivos.

---

## 🎯 Siguiente Paso:

Una vez en GitHub, sigue **`GUIA_RAPIDA_RENDER.md`** para desplegar en Render.

