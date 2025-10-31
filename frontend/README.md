# NODO+ Frontend

Aplicación web React para la plataforma NODO+.

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Scripts

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Previsualiza build de producción
- `npm run lint` - Ejecuta linter

## Estructura

```
src/
├── components/    # Componentes reutilizables
├── pages/         # Páginas/Views
├── stores/        # Estado global (Zustand)
├── services/      # Servicios API
└── App.tsx        # Componente principal
```

