import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  logLevel: 'error',
  build: {
    target: 'esnext',
    reportCompressedSize: false,
    emptyOutDir: false,
    lib: {
      entry: 'index.ts',
      name: 'database',
      formats: ['es'],
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['@prisma/client'],
      output: {},
    },
  },
})
