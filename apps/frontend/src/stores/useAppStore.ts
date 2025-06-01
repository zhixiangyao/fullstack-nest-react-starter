import type { ThemeConfig } from 'antd'
import { theme } from 'antd'
import { Map } from 'immutable'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface Store {
  sizes: number[]
  theme: ThemeConfig

  handleSizes: (sizes: number[]) => void
  handleSwitchLight: () => void
  handleSwitchDark: () => void
}

const useAppStore = create<Store>()(
  persist(
    set => ({
      sizes: [80],
      theme: {
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#00b96b',
          borderRadius: 2,
        },
      },

      handleSizes: (sizes: number[]) => set({ sizes }),
      handleSwitchLight: () =>
        set(state => ({
          theme: Map(state.theme).set('algorithm', theme.defaultAlgorithm).toObject(),
        })),
      handleSwitchDark: () =>
        set(state => ({
          theme: Map(state.theme).set('algorithm', theme.darkAlgorithm).toObject(),
        })),
    }),
    {
      name: 'storage__app',
      storage: createJSONStorage(() => {
        return sessionStorage
      }),
      partialize: (state) => {
        return Object.fromEntries(Object.entries(state).filter(([key]) => !['loaded', 'loading'].includes(key)))
      },
    },
  ),
)

export { useAppStore }
