
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],

  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        dashboard: resolve(import.meta.dirname, 'pages/dashboard.html'),
        finances: resolve(import.meta.dirname, 'pages/finances.html'),
        simulator: resolve(import.meta.dirname, 'pages/simulator.html'),
        learn: resolve(import.meta.dirname, 'pages/learn.html'),
        settings: resolve(import.meta.dirname, 'pages/settings.html'),
      },
    },
  },
})
