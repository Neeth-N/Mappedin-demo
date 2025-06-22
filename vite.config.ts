import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Mappedin-demo/', // 🔥 Required for GitHub Pages
})
