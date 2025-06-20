// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Allow the Render URL
    allowedHosts: ['class-management-frontend.onrender.com'],
    host: true // This is also helpful for Docker
  }
})
