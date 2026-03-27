import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Shop Smart — India\'s Smartest Store',
        short_name: 'ShopSmart',
        description: 'Shop electronics, fashion, books & more at the best prices.',
        theme_color: '#f59e0b',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'https://via.placeholder.com/192x192/f59e0b/ffffff?text=SS', sizes: '192x192', type: 'image/png' },
          { src: 'https://via.placeholder.com/512x512/f59e0b/ffffff?text=SS', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
            }
          }
        ]
      }
    })
  ],
})
