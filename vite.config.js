import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@services': '/src/services',
      '@context': '/src/context',
      '@styles': '/src/styles',
      '@hooks': '/src/hooks',
      '@models': '/src/models',
    },
  },
})
