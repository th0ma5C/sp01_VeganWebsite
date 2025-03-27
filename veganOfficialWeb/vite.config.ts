import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'path'
import { execSync } from 'child_process'
import pkg from './package.json'

/// <reference types="vitest/config" />

// https://vitejs.dev/config/

const commitHash = execSync('git rev-parse --short HEAD').toString().trim()

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

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
      viteMockServe({
        mockPath: 'mock',
        enable: true,
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
      // open: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
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
