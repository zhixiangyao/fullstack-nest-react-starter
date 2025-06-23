import type { User, UserCreateRequest, UserCreateResponse, UserLoginRequest } from '~/fetchers'
import { getStorageStateByKey } from 'utils'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import * as fetchers from '~/fetchers'

interface Store {
  remember: boolean
  loading: boolean
  loaded: boolean

  token: string | null
  user: User | null

  handleRemember: (remember: boolean) => void
  handleToken: (token: string) => void
  handleClear: () => void
  handleLogin: (params: UserLoginRequest) => Promise<void>
  handleLogout: () => Promise<void>
  handleCreate: (params: UserCreateRequest, successfulCallback?: (response: UserCreateResponse) => void) => Promise<void>
  handleGetCurrentUserInfo: () => Promise<void>
}

const useUserStore = create<Store>()(
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
          const { data } = await fetchers.userLogin(params)
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
      handleCreate: async (params, successfulCallback) => {
        try {
          set(() => ({ loading: true }))
          const response = await fetchers.userCreate(params)
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
          const { data } = await fetchers.userFind()
          set(() => ({ user: data.user, loaded: true }))
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

        return remember ? localStorage : sessionStorage
      }),
      partialize: (state) => {
        return Object.fromEntries(Object.entries(state).filter(([key]) => !['loaded', 'loading'].includes(key)))
      },
    },
  ),
)

export { useUserStore }
