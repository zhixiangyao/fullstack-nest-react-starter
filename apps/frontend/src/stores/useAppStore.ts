import { create } from 'zustand'

interface Store {
  width: number
  collapsed: boolean
  isLoginOrRegister: 'login' | 'register'
  disable: boolean

  handleCollapsed: () => void
  handleSwitchLoginOrRegister: () => void
  handleDisable: (disable: boolean) => void
}

export const useAppStore = create<Store>()((set, get) => ({
  width: 200,
  collapsed: true,
  isLoginOrRegister: 'login',
  disable: false,

  handleCollapsed: () => get().disable === false && set(({ collapsed }) => ({ collapsed: !collapsed })),
  handleSwitchLoginOrRegister: () => {
    set(({ isLoginOrRegister }) => {
      return { isLoginOrRegister: isLoginOrRegister === 'login' ? 'register' : 'login' }
    })
  },
  handleDisable: disable => set({ disable }),
}))
