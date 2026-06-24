// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: 'CineSphere',
        short_name: 'CineSphere',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a', // Tailwind slate-900
        theme_color: '#38bdf8', // Tailwind sky-400
        icons: [
          {
            src: '/vite.svg', // Fallback to vite svg since icon.png might not exist
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          }
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})





// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';

// export default defineConfig({
//   plugins: [
//     react(),
//     VitePWA({
//       registerType: 'autoUpdate',
//       devOptions: { enabled: true },
//       manifest: {
//         name: 'Cinesphere',
//         short_name: 'Cinesphere',
//         start_url: '/',
//         display: 'standalone',
//         background_color: '#ffffff',
//         theme_color: '#000000',
//         icons: [
//           {
//             src: '/assets/icon.png',
//             sizes: '192x192',
//             type: 'image/png',
//           },
//         ],
//       },
//     }),
//   ],
// });
