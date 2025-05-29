import { create } from 'zustand'

interface Store {
  sizes: number[]
  state: 'login' | 'register'

  handleSwitchSate: () => void
  handleSizes: (sizes: number[]) => void
}

const useAppStore = create<Store>()(set => ({
  sizes: [80],
  state: 'login',

  handleSwitchSate: () => {
    set(({ state }) => ({ state: state === 'login' ? 'register' : 'login' }))
  },
  handleSizes: (sizes: number[]) => set({ sizes }),
}))

export { useAppStore }
