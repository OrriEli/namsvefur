import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build` → dist/ (GitHub Pages). `npm run build:single` → dist-single/index.html, ein skrá.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: mode === 'single' ? [viteSingleFile()] : [],
  build: { outDir: mode === 'single' ? 'dist-single' : 'dist', emptyOutDir: true },
  test: { include: ['tests/**/*.test.js'], testTimeout: 60000 }
}));
