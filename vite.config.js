import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build` → dist/ (GitHub Pages). `npm run build:single` → dist-single/index.html, ein skrá
// (KaTeX-letrið er þá innbyggt). Efni fimm faganna er um 2 MB af JavaScript, svo stærðarviðvörun er hækkuð.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: mode === 'single' ? [viteSingleFile()] : [],
  build: {
    outDir: mode === 'single' ? 'dist-single' : 'dist', emptyOutDir: true,
    chunkSizeWarningLimit: 4000,
    assetsInlineLimit: mode === 'single' ? 1e8 : 4096
  },
  test: { include: ['tests/**/*.test.js'], testTimeout: 120000 }
}));
