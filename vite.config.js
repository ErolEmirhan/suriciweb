import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: '0.0.0.0', // Tüm ağ arayüzlerinde dinle
    port: 3000,
    open: true
  }
})

