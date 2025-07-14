import type { ThemeConfig } from 'antd'
import type { MessageInstance } from 'antd/es/message/interface'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const ROOT_WIDTH = document.querySelector('#root')?.getBoundingClientRect().width

interface Size {
  width: number
  height: number
}

interface Store {
  mode: 'dark' | 'light'
  size: Size | undefined
  leftWidth: number
  rightWidth: number | undefined
  token: ThemeConfig['token']
  message: MessageInstance | undefined

  handleWindowSize: (size: NonNullable<Store['size']>) => void
  handleSplitterSizes: (sizes: number[]) => void
  handleSwitchMode: (mode: Store['mode']) => void
  handleInitMessage: (message: MessageInstance) => void
}

const useAppStore = create<Store>()(
  persist(
    set => ({
      mode: 'dark',
      size: void 0,
      leftWidth: 80,
      rightWidth: ROOT_WIDTH ? ROOT_WIDTH - 80 : void 0,
      token: {
        colorPrimary: '#00b96b',
        borderRadius: 2,
      },
      message: void 0,

      handleWindowSize: size =>
        set(state => ({ size, leftWidth: state.leftWidth, rightWidth: size.width - state.leftWidth })),
      handleSplitterSizes: sizes => set({ leftWidth: sizes[0], rightWidth: sizes[1] }),
      handleSwitchMode: mode => set({ mode }),
      handleInitMessage: message => set({ message }),
    }),
    {
      name: 'storage__app',
      storage: createJSONStorage(() => {
        return sessionStorage
      }),
      partialize: (state) => {
        return Object.fromEntries(Object.entries(state).filter(([key]) => !['message'].includes(key)))
      },
    },
  ),
)

export { useAppStore }
