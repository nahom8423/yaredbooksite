import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/yaredbooksite/', // Your GitHub repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
