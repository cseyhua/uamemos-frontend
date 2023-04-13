import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api':'http://localhost:8081/api'
    }
  },
  resolve:{
    alias:{
      "@":resolve(__dirname, "src")
    }
  }
})
