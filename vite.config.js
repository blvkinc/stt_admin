import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': (() => {
        const possiblePaths = [
          path.resolve(__dirname, '../../shared'),
          path.resolve(__dirname, '../shared'),
          path.resolve(__dirname, './shared')
        ];
        for (const p of possiblePaths) {
          if (fs.existsSync(p)) {
            return p;
          }
        }
        return path.resolve(__dirname, '../../shared');
      })()
    }
  },
  server: {
    port: 3002,
    open: false
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000
  }
})
