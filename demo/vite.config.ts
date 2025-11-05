import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    })
  ],
  root: path.resolve(__dirname),
  publicDir: false,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: path.resolve(__dirname, 'dist')
  }
})
