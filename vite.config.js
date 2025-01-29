import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      include: []
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@clerk/clerk-react',
      '@mui/material',
      '@mui/icons-material',
      'framer-motion',
      'recharts'
    ]
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})