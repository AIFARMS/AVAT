import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

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
