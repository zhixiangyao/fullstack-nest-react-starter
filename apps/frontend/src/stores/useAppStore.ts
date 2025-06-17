import type { ThemeConfig } from 'antd'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const ROOT_WIDTH = document.querySelector('html')?.getBoundingClientRect().width

interface Store {
  mode: 'dark' | 'light'
  leftWidth: number
  rightWidth: number | undefined
  token: ThemeConfig['token']

  handleSizes: (sizes: number[]) => void
  handleSwitchLight: () => void
  handleSwitchDark: () => void
}

const useAppStore = create<Store>()(
  persist(
    set => ({
      mode: 'dark',
      leftWidth: 80,
      rightWidth: ROOT_WIDTH ? ROOT_WIDTH - 80 : void 0,
      token: {
        colorPrimary: '#00b96b',
        borderRadius: 2,
      },

      handleSizes: sizes => set({ leftWidth: sizes[0], rightWidth: sizes[1] }),
      handleSwitchLight: () => set({ mode: 'light' }),
      handleSwitchDark: () => set({ mode: 'dark' }),
    }),
    {
      name: 'storage__app',
      storage: createJSONStorage(() => {
        return sessionStorage
      }),
    },
  ),
)

export { useAppStore }
