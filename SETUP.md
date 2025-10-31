# Guía de Configuración - NODO+

## 📋 Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL instalado y corriendo
- npm o yarn

## 🚀 Configuración Inicial

### 1. Backend

```bash
cd backend
npm install
```

2. Crear archivo `.env`:
```bash
cp .env.example .env
```

Editar `.env` y configurar:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nodo_plus?schema=public"
JWT_SECRET="tu-secret-key-super-seguro"
PORT=3001
FRONTEND_URL=http://localhost:3000
```

3. Generar cliente Prisma y crear base de datos:
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

4. Iniciar servidor:
```bash
npm run dev
```

El backend estará disponible en `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## 🗄️ Base de Datos

### Modelos Principales

- **User**: Usuarios del sistema (Admin, EdTech, IE, Consultante)
- **EdTechCompany**: Empresas EdTech registradas
- **Solution**: Soluciones/productos EdTech con fichas técnicas
- **Institution**: Instituciones Educativas
- **IEMatch**: Matching entre IEs y Soluciones
- **Evidence**: Documentos y evidencias de soluciones
- **Catalog**: Catálogos configurables (niveles, áreas, tipos, etc.)
- **TrafficLightRule**: Reglas para cálculo de semáforos
- **ConsultantProfile**: Perfiles de consultantes

### Credenciales por Defecto

Después de ejecutar el seed:
- **Admin**: admin@nodo-plus.com / admin123

## 📝 Comandos Útiles

### Backend
- `npm run dev` - Desarrollo
- `npm run build` - Compilar para producción
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:studio` - Abrir Prisma Studio (interfaz visual)
- `npm run db:seed` - Ejecutar seed de datos iniciales

### Frontend
- `npm run dev` - Desarrollo
- `npm run build` - Compilar para producción
- `npm run preview` - Previsualizar build

## 🎨 Características del Landing

- **Colores**: Tonos azules educativos con azul rey (navy)
- **Logo**: "N+" con gradiente azul
- **Diseño**: Mobile-first, responsive
- **Estilo**: Moderno y profesional

## 📚 Estructura del Proyecto

```
nodo-plus/
├── backend/          # API Node.js + Express + Prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── services/
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
├── frontend/         # React + TypeScript + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   └── App.tsx
└── README.md
```

