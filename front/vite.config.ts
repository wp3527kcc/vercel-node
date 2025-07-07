import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'https://tc-test-crm.tuchong.com/uploadProject/',
  // base: '/dist/',
  server: {
    port: 4047,
    strictPort: true,
    proxy: {
      '/api/': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
      },
    },
  }
})
