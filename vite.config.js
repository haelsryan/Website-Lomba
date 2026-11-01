import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        dashboard: resolve(import.meta.dirname, 'pages/html/dashboard.html'),
        finances: resolve(import.meta.dirname, 'pages/html/finances.html'),
        simulator: resolve(import.meta.dirname, 'pages/html/simulator.html'),
        learn: resolve(import.meta.dirname, 'pages/html/learn.html'),
        settings: resolve(import.meta.dirname, 'pages/html/settings.html'),
      },
    },
  },
})