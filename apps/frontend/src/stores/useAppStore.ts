import { create } from 'zustand'

interface Store {
  sizes: number[]

  handleSizes: (sizes: number[]) => void
}

const useAppStore = create<Store>()(set => ({
  sizes: [80],

  handleSizes: (sizes: number[]) => set({ sizes }),
}))

export { useAppStore }
