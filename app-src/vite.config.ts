import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/sai-tarot-privacy/app/',
  build: { outDir: '../app', emptyOutDir: true },
})
