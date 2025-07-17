import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  logLevel: 'error',
  build: {
    target: 'esnext',
    reportCompressedSize: false,
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'utils',
      formats: ['es'],
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['dayjs'],
    },
  },
})
