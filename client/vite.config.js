import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// In development, API calls are proxied to the Express server on :8080
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/healthz': 'http://localhost:8080',
    },
  },
})
