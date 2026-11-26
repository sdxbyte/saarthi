import fs from 'fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const pkgVersion = (() => {
  try {
    const raw = fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8');
    return JSON.parse(raw).version || '1.0.0';
  } catch {
    return '1.0.0';
  }
})();

export default defineConfig(() => {
  return {
    define: {
      __SAARTHI_APP_VERSION__: JSON.stringify(pkgVersion),
      __SAARTHI_BUILD_NUMBER__: JSON.stringify(process.env.VITE_APP_BUILD_NUMBER || '0'),
      __SAARTHI_BUILD_SHA__: JSON.stringify(process.env.VITE_APP_COMMIT_SHA || ''),
      __SAARTHI_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifestFilename: 'manifest.json',
        includeAssets: ['favicon.ico', 'favicon.png', 'apple-touch-icon.png', 'offline.html', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png'],
        manifest: {
          id: '/',
          name: 'SAARTHI — Nepali Calendar, Finance & Utilities',
          short_name: 'SAARTHI',
          description: 'Independent digital platform for 136-year Bikram Sambat calendar, NRB forex rates, tax/EMI calculators, utilities, and issue tracking.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'any',
          theme_color: '#0f172a',
          background_color: '#090d16',
          categories: ['utilities', 'finance', 'productivity', 'tools'],
          lang: 'en',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          shortcuts: [
            {
              name: 'Nepali Calendar',
              short_name: 'Calendar',
              description: '136-Year Bikram Sambat Calendar & Converter',
              url: '/?tab=calendar',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'NRB Forex Rates',
              short_name: 'Forex',
              description: 'Official NRB Foreign Exchange Rates',
              url: '/?tab=forex',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'NEPSE Market',
              short_name: 'NEPSE',
              description: 'Live Stock Market & CDSC IPO Suite',
              url: '/?tab=nepse',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Report an Issue',
              short_name: 'Support',
              description: 'Submit Issue Report or Feedback',
              url: '/?tab=contact',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/api\//, /^\/\.well-known\//],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^\/api\/(live|calendar)\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'saarthi-live-api-cache',
                networkTimeoutSeconds: 4,
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: ['es2019', 'chrome87', 'edge88', 'firefox78', 'safari13'],
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            'vendor-dates': ['nepali-date-converter', '@sbmdkl/nepali-date-converter', 'bikram-sambat'],
            'vendor-ui': ['lucide-react', 'motion'],
            'vendor-pdf': ['jspdf'],
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify--file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
