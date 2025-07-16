import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use root path for custom domain, repository path for GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  define: {
    // Fix for crypto.hash issues
    global: 'globalThis',
  },
})
