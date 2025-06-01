import type { ThemeConfig } from 'antd'
import { theme } from 'antd'
import { Map } from 'immutable'
import { create } from 'zustand'

interface Store {
  sizes: number[]
  theme: ThemeConfig

  handleSizes: (sizes: number[]) => void
  handleSwitchLight: () => void
  handleSwitchDark: () => void
}

const useAppStore = create<Store>()(set => ({
  sizes: [80],
  theme: {
    // 1. 单独使用暗色算法
    algorithm: theme.darkAlgorithm,
    token: {
      // Seed Token，影响范围大
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
}))

export { useAppStore }
