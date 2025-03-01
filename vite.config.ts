import vue from '@vitejs/plugin-vue';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';

// https://vite.dev/config/
export default defineConfig({
  root: dirname(fileURLToPath(import.meta.url)),
  plugins: [
    electron({
      main: {
        entry: fileURLToPath(
          new URL('./src/electron/main.ts', import.meta.url),
        ),
      },
      preload: {
        input: fileURLToPath(
          new URL('./src/electron/preload.ts', import.meta.url),
        ),
      },
    }),
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
