import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  optimizeDeps: {
    exclude: ['tesseract.js'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          framer: ['framer-motion'],
          spring: ['@react-spring/web'],
          gesture: ['@use-gesture/react'],
        },
      },
    },
  },
})
