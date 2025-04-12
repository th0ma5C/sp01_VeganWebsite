import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import { execSync } from 'child_process'
import pkg from './package.json'
import viteImagemin from 'vite-plugin-imagemin';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from "rollup-plugin-visualizer";

/// <reference types="vitest/config" />

// https://vitejs.dev/config/

const commitHash = execSync('git rev-parse --short HEAD').toString().trim()

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      __APP_VERSION__: JSON.stringify(`${pkg.version} (${commitHash})`),
      __APP_BUILD_TIME__: JSON.stringify(new Date().toLocaleDateString())
    },
    build: {
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0];
            }
            if (id.includes('src/pages/Home')) {
              if (id.includes('Marquee.vue')) return 'marquee'
              if (id.includes('MainBanner.vue')) return 'main-banner'
              if (id.includes('SubBanner.vue')) return 'sub-banner'
              if (id.includes('Catalog.vue')) return 'catalog'
              if (id.includes('Location.vue')) return 'location'
              if (id.includes('Concept.vue')) return 'concept'
              if (id.includes('Hiring.vue')) return 'hiring'
            }
          }
        }
      },
      esbuild: {
        drop: ['console']
      }
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag.startsWith('swiper')
          }
        }
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 80,
          progressive: true
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeEmptyAttrs',
              active: true,
            },
            {
              name: 'removeMetadata',
              active: true
            },
            {
              name: 'cleanupIDs',
              active: true
            },
            {
              name: 'removeComments',
              active: true
            },
            {
              name: 'convertStyleToAttrs',
              active: true
            }
          ],
        },
        webp: {
          quality: 75,
        },
        filter: (source: string) => {
          const normalized = source.replace(/\\/g, '/')

          const shouldSkip = /bac_wood/.test(normalized) || /subBanner_/.test(normalized)

          return /\.(jpe?g|png|gif|svg|webp)$/i.test(normalized) && !shouldSkip
        }
      }),
      viteCompression({
        deleteOriginFile: false,
        filter: (file) => {
          return /\.(js|css|html|json)$/.test(file);
        },
      }),
      visualizer({
        filename: './stats.html',
        gzipSize: true,
        brotliSize: true
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'https://tmc4web.dev',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/images/, '/images'),
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/style/variables.scss" as *;'
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      deps: {
        inline: ['vue']
      }
    }
  }
})
