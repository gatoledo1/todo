import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'To-Do',
        short_name: 'To-Do',
        description: 'Lista de tarefas',
        theme_color: '#0d0d0d',
        icons: [
          {
            src: 'src/assets/todoLogo.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'src/assets/todoLogo.svg',
            sizes: '360x360',
            type: 'image/svg+xml'
          },
          {
            src: 'src/assets/todoLogo.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ]
})
