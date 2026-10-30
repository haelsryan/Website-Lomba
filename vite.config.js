
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
        home: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'pages/dashboard.html'),
        finances: resolve(__dirname, 'pages/finances.html'),
        simulator: resolve(__dirname, 'pages/simulator.html'),
        learn: resolve(__dirname, 'pages/learn.html'),
        settings: resolve(__dirname, 'pages/settings.html'),
      },
    },
  },
})
