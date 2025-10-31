# 🎯 Haz Esto AHORA

## ⚠️ MUY IMPORTANTE:

**Ejecuta los comandos desde `C:\nodo-plus`, NO desde tu carpeta de usuario.**

---

## ✅ PASOS EXACTOS:

### 1️⃣ Abrir Git Bash CORRECTAMENTE

**Opción A - Más fácil:**
- Abre el explorador de Windows
- Navega a: `C:\nodo-plus`
- Click derecho en la carpeta
- Selecciona **"Git Bash Here"**

**Opción B - Desde Git Bash ya abierto:**
```bash
cd /c/nodo-plus
pwd
# Debe mostrar: /c/nodo-plus
```

---

### 2️⃣ Ejecutar estos comandos:

```bash
# Configurar (solo primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Inicializar
git init

# Agregar archivos
git add .

# Commit
git commit -m "Initial commit - NODO+ ready for Render"
```

---

### 3️⃣ Crear repo en GitHub

1. Ve a: https://github.com/new
2. Nombre: `nodo-plus`
3. ❌ NO marques "Initialize with README"
4. Click **"Create repository"**

---

### 4️⃣ Subir código

```bash
git remote add origin https://github.com/TU_USUARIO/nodo-plus.git
git branch -M main
git push -u origin main
```

**Cambia `TU_USUARIO` por tu username de GitHub**

---

## ✅ Verifica:

Ve a: https://github.com/TU_USUARIO/nodo-plus

Deberías ver tus archivos.

---

## 📞 Si tienes problemas:

Comparte:
- El output de `pwd`
- El error que ves
