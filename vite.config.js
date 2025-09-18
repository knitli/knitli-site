import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'frontend',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'frontend/index.html')
      }
    },
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    sourcemap: false,
    assetsInlineLimit: 4096, // Inline small assets as base64
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['posthog-js']
  },
  // Optimize assets
  assetsInclude: ['**/*.webp', '**/*.avif', '**/*.svg']
});