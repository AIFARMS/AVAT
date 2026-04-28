import path from 'path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  const { default: tailwindcss } = await import('@tailwindcss/vite');

  return {
    plugins: [react(), tailwindcss()],
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
