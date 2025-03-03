import vue from '@vitejs/plugin-vue';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import autoImport from 'unplugin-auto-import/vite';
import { AliasOptions, defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';

const alias: AliasOptions = {
  '@': fileURLToPath(new URL('./src', import.meta.url)),
};

// https://vite.dev/config/
export default defineConfig({
  root: dirname(fileURLToPath(import.meta.url)),
  plugins: [
    vue(),
    autoImport({
      imports: ['@vueuse/core', 'pinia', 'vue', 'vue-router'],
      include: [/\.ts$/, /\.vue$/],
      injectAtEnd: true,
      vueTemplate: true,
    }),
    electron({
      main: {
        entry: fileURLToPath(
          new URL('./src/electron/main.ts', import.meta.url),
        ),
        vite: {
          resolve: {
            alias,
          },
        },
      },
      preload: {
        input: fileURLToPath(
          new URL('./src/electron/preload.ts', import.meta.url),
        ),
        vite: {
          resolve: {
            alias,
          },
        },
      },
    }),
  ],
  resolve: {
    alias,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
