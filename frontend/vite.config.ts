import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0', // Escucha en todas las interfaces de red
    strictPort: false,
    // HMR deshabilitado para desarrollo local
    // hmr: {
    //   clientPort: 443, // Solo activar si usas ngrok
    // },
    allowedHosts: true, // Permite todos los hosts (útil con ngrok)
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: true
  },
  // Configuración para variables de entorno
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || '')
  }
})

