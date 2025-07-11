import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ tsconfigPath: './tsconfig.json' })],
  logLevel: 'error',
  build: {
    target: 'esnext',
    reportCompressedSize: false,
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'Utils',
      formats: ['es'],
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['dayjs'],
    },
  },
})
