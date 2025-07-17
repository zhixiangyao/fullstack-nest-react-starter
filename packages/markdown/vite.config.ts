import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

export default defineConfig({
  plugins: [react(), tailwindcss(), libInjectCss()],
  logLevel: 'error',
  build: {
    target: 'esnext',
    reportCompressedSize: false,
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'markdown',
      formats: ['es'],
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'remark-parse'],
      output: {
        globals: {
          react: 'React',
        },
        // This line is key! It controls all chunk names.
        chunkFileNames: '[name].js', // Or just '[name].js' if you prefer them directly in 'dist'
      },
    },
  },
})
