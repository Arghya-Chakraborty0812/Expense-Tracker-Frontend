import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,      // Automatically uses your local IP
    port: 5173,      // Optional, can be changed if needed
  },
})
