import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/chinese_ver_abstract_thoughts/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  },
  server: {
    hmr: {
      overlay: false, // Disable HMR overlay
    }
  },
  css: {
    postcss: './postcss.config.js', // Explicit path to PostCSS config
  },
})