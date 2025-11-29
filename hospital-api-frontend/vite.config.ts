import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite para React
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Puerto fijo para evitar conflictos
    open: true, // Abre automáticamente el navegador
  },
  resolve: {
    alias: {
      '@': '/src', // Alias para importar desde la raíz del src
    },
  },
  build: {
    outDir: 'dist', // Carpeta de salida para el build
    sourcemap: true, // Facilita la depuración
  },
})