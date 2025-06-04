import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Don't minify console statements in production
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Preserve console logs
        manualChunks: undefined,
      }
    }
  },
  esbuild: {
    // Keep console logs in production
    drop: process.env.NODE_ENV === 'production' ? [] : undefined,
  },
  define: {
    // Enable logging in production
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  }
})
