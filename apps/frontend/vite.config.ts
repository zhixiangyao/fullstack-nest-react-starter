import type { ConfigEnv, UserConfig } from 'vite'
import { resolve } from 'node:path'
import { vitePlugin as remix } from '@remix-run/dev'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const baseConfig: UserConfig = {
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: [{ find: '~', replacement: resolve(__dirname, './app') }],
  },
}

export default ({ command }: ConfigEnv) => {
  if (command === 'serve') {
    return defineConfig(baseConfig)
  }
  else {
    return defineConfig({
      ...baseConfig,
      logLevel: 'error',
    })
  }
}
