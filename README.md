# NODO+ - Plataforma de Conectividad EdTech

Plataforma que conecta necesidades de aprendizaje y contextos educativos con soluciones tecnológicas pertinentes y transformadoras.

## Stack Tecnológico

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT para autenticación
- Nodemailer para emails

### Frontend
- React + TypeScript
- TailwindCSS (diseño mobile-first)
- React Router
- React Hook Form

### Desarrollo
- Desarrollo en fases:
  - **Fase 1**: EdTech + Admin (catálogo base)
  - **Fase 2**: IE (caracterización + matching)
  - **Fase 3**: Consultantes (navegación abierta y filtros avanzados)

## Estructura del Proyecto

```
nodo-plus/
├── backend/          # API Node.js + Express
├── frontend/         # Aplicación React
├── shared/           # Tipos TypeScript compartidos
└── docs/             # Documentación
```

## Usuarios

1. **EdTech**: Empresas que registran sus soluciones
2. **Institución Educativa**: Caracterizan su contexto y reciben recomendaciones
3. **Consultante**: Acceso al catálogo filtrado
4. **Administrador**: Gestión completa de la plataforma

## 🚀 Inicio Rápido

### Para Desarrollo Local

Ver **`backend/README.md`** para instrucciones detalladas.

#### Pasos Rápidos:

1. **Script automatizado** (Windows):
   ```bash
   INICIAR_SERVIDORES.bat
   ```

2. **Manual**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

3. **Abrir**: http://localhost:3000

**Credenciales de prueba:**
- Admin: `admin@nodo-plus.com` / `admin123`
- EdTech: `contacto@platzi.com` / `pass`
- IE: `info@colegiolosnogales.edu.co` / `pass`

### Para Despliegue en Producción (Render.com)

Ver **`GUIA_RAPIDA_RENDER.md`** para instrucciones completas.

#### Resumen:
1. Sube código a GitHub
2. Crea base de datos PostgreSQL en Render
3. Crea Web Service para Backend
4. Crea Static Site para Frontend
5. ¡Listo! Tu app estará live

---

## 📚 Documentación

### Desarrollo
- **`backend/README.md`** - Setup y desarrollo del backend
- **`INSTRUCCIONES_COMPLETAS.md`** - Guía completa paso a paso
- **`PROBLEMA_Y_SOLUCION.md`** - Troubleshooting común

### Despliegue
- **`GUIA_RAPIDA_RENDER.md`** ⭐ - Cómo desplegar en Render.com
- **`DESPLEGAR_RENDER.md`** - Guía detallada de despliegue
- **`INICIAR_CON_NGROK.md`** - Acceso temporal externo

### Scripts Disponibles
- `INICIAR_SERVIDORES.bat` - Inicia backend y frontend
- `INICIAR_NGROK.bat` - Expone app con ngrok
- `arreglar_env.bat` - Configura .env básico

## 🌐 Características Actuales

- ✅ Catálogo de 15+ soluciones EdTech colombianas
- ✅ 14 instituciones educativas registradas
- ✅ Sistema de evaluación con 6 criterios y semáforos
- ✅ Dashboard de administración
- ✅ Login multi-rol (Admin, EdTech, IE)
- ✅ Filtros y ordenamiento en catálogo
- ✅ Visualización con gráficos de telaraña
- ✅ Listado de instituciones educativas
- ✅ Footer credencial Nogales+

## 🎯 Próximas Características

- ⏳ OAuth (Google, Microsoft)
- ⏳ Caracterización de instituciones educativas
- ⏳ Sistema de matching inteligente
- ⏳ Portal para consultantes
- ⏳ Exportación de datos

