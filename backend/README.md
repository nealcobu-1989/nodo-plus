# NODO+ Backend

API REST para la plataforma NODO+.

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. Configurar base de datos:
```bash
# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate
```

4. Iniciar servidor de desarrollo:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

## Scripts

- `npm run dev` - Inicia servidor en modo desarrollo
- `npm run build` - Compila TypeScript
- `npm start` - Inicia servidor en producción
- `npm run db:migrate` - Ejecuta migraciones de base de datos
- `npm run db:generate` - Genera cliente Prisma
- `npm run db:studio` - Abre Prisma Studio (interfaz visual de BD)

## Estructura

```
src/
├── controllers/    # Controladores de rutas
├── routes/         # Definición de rutas
├── middleware/     # Middlewares (auth, error handling)
├── services/       # Lógica de negocio
└── index.ts        # Punto de entrada
```

