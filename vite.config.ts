import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Change 'jnanayoni' to your GitHub repository name if deploying to GitHub Pages
  base: './', 
})