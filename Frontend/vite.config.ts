import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': { target: 'http://localhost:8001', changeOrigin: true },
      '/readiness': { target: 'http://localhost:8001', changeOrigin: true },
      '/health': { target: 'http://localhost:8001', changeOrigin: true },
      '/supabase-proxy': {
        target: 'https://ca-kong.lemonfield-5ba69bbc.southcentralus.azurecontainerapps.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase-proxy/, ''),
      },
    },
    headers: {
      // Previene Clickjacking
      'X-Frame-Options': 'DENY',
      // Previene MIME-sniffing attacks
      'X-Content-Type-Options': 'nosniff',
      // Oculta el origen del Referer al navegar fuera
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Deshabilita funciones del browser no necesarias
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      // Content-Security-Policy: permite solo fuentes conocidas
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://esm.sh",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' http://localhost:8001 http://localhost:5174 ws://localhost:5174 https://ca-kong.lemonfield-5ba69bbc.southcentralus.azurecontainerapps.io https://ca-backend.lemonfield-5ba69bbc.southcentralus.azurecontainerapps.io https://evangelista-backend.onrender.com https://evangelista-rag-private.azurewebsites.net https://esm.sh",
        "frame-ancestors 'none'",
      ].join('; '),
    },
  },
})

