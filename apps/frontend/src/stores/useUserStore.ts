import type { LoginRequest, RegisterRequest, RegisterResponse, TUser } from '~/fetchers/type'
import { getStorageStateByKey } from 'utils'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { getCurrentUserInfo, login, register } from '~/fetchers'

interface Store {
  remember: boolean
  loading: boolean
  loaded: boolean

  token: string | null
  user: TUser | null

  handleRemember: (remember: boolean) => void
  handleToken: (token: string) => void
  handleClear: () => void
  handleLogin: (params: LoginRequest) => Promise<void>
  handleLogout: () => Promise<void>
  handleRegister: (params: RegisterRequest, successfulCallback?: (response: RegisterResponse) => void) => Promise<void>
  handleGetCurrentUserInfo: () => Promise<void>
}

export const useUserStore = create<Store>()(
  persist(
    (set, get) => ({
      remember: true,
      loading: false,
      loaded: false,

      token: null,
      user: null,

      handleRemember: (remember) => {
        useUserStore.persist?.clearStorage()
        useUserStore.persist?.setOptions({
          storage: createJSONStorage(() => (remember ? localStorage : sessionStorage)),
        })
        set(() => ({ remember }))
      },
      handleToken: token => set(() => ({ token })),
      handleClear: () => set(() => ({ token: null })),
      handleLogin: async (params) => {
        try {
          set(() => ({ loading: true }))
          const { data } = await login(params)
          set(() => ({ token: data.token }))
        }
        catch {
          get().handleClear()
        }
        finally {
          set(() => ({ loading: false }))
        }
      },
      handleLogout: async () => {
        get().handleClear()
      },
      handleRegister: async (params, successfulCallback) => {
        try {
          set(() => ({ loading: true }))
          const response = await register(params)
          successfulCallback?.(response)
        }
        finally {
          set(() => ({ loading: false }))
        }
      },
      handleGetCurrentUserInfo: async () => {
        try {
          set(() => ({ loading: true }))
          if (get().token === null)
            return
          const { data } = await getCurrentUserInfo()
          set(() => ({ user: data.user, loaded: true }))
        }
        catch {
          get().handleClear()
        }
        finally {
          set(() => ({ loading: false }))
        }
      },
    }),
    {
      name: 'storage__user',
      storage: createJSONStorage(() => {
        const remember = getStorageStateByKey<{ state?: Store }>('storage__user')?.state?.remember

        return remember === false ? sessionStorage : localStorage
      }),
      partialize: (state) => {
        return Object.fromEntries(Object.entries(state).filter(([key]) => !['loaded', 'loading'].includes(key)))
      },
    },
  ),
)
