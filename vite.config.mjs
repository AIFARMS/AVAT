import path from 'path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const jsAsJsx = {
  name: 'js-as-jsx',
  enforce: 'pre',
  async transform(code, id) {
    if (!/src\/.*\.js$/.test(id)) {
      return null;
    }

    return transformWithEsbuild(code, id, {
      loader: 'jsx',
      jsx: 'transform',
    });
  },
};

export default defineConfig({
  plugins: [jsAsJsx, react(), tailwindcss()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
