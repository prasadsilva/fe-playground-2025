import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // @tanstack/router-plugin must be passed before @vitejs/plugin-react-swc
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      virtualRouteConfig: './src/routes.ts',
    }),
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  // Base path is handled by tanstack router (see main.tsx)
})
