// vector-search-demo/vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Wrap in function to access env variables
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Dev API defaults to localhost, prod uses environment variable
  const apiBase = mode === 'production' 
    ? env.API_URL || 'https://your-prod-api.com'
    : 'http://localhost:3003';

  return {
    plugins: [react()],
    
    resolve: {
      alias: {
        'three': 'three',
        'three/addons/': 'three/examples/jsm/',  // Added comma here
        '@': path.resolve(__dirname, './src')     // Removed comma here
      }
    },

    // Base URL configuration for production deployment
    base: mode === 'production' ? env.BASE_URL || '/' : '/',

    // Environment variables to expose to the client
    define: {
      __API_BASE__: JSON.stringify(apiBase),
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    // Server configuration
    server: {
      port: 5173,
      // Proxy configuration for development
      proxy: {
        '/api': {
          target: apiBase,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          // Enable secure proxy if needed
          secure: mode === 'production',
        }
      }
    },

    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode === 'production',
      minify: mode === 'production' ? 'esbuild' : false,
      chunkSizeWarningLimit: 1000,
      
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    },

    // Preview configuration for testing production builds locally
    preview: {
      port: 4173,
      strictPort: true,
    }
  };
});