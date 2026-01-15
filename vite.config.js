import { defineConfig } from 'vite'

export default defineConfig({
  base: '/robo-eyes/',
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
})
