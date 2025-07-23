import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // @tanstack/router-plugin must be passed before @vitejs/plugin-react-swc
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      virtualRouteConfig: './src/routes.ts',
    }),
    react()
  ],
})
