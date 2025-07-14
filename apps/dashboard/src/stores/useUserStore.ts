import type { User, UserCreateRequest, UserCreateResponse, UserLoginRequest } from '~/fetchers'
import { getStorageStateByKey } from 'utils'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import * as fetchers from '~/fetchers'

interface Store {
  remember: boolean
  token: string | null
  user: User | null

  handleRemember: (remember: boolean) => void
  handleToken: (token: string) => void
  handleClear: () => void
  handleLogin: (params: UserLoginRequest) => Promise<void>
  handleLogout: () => Promise<void>
  handleCreate: (params: UserCreateRequest, cb?: (response: UserCreateResponse) => void) => Promise<void>
  handleGetCurrentUserInfo: () => Promise<void>
}

const useUserStore = create<Store>()(
  persist(
    (set, get) => ({
      remember: true,
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
          const { data } = await fetchers.userLogin(params)
          set(() => ({ token: data.token }))
          await get().handleGetCurrentUserInfo()
        }
        catch {
          get().handleClear()
        }
      },
      handleLogout: async () => {
        get().handleClear()
      },
      handleCreate: async (params, cb) => {
        const response = await fetchers.userCreate(params)
        cb?.(response)
      },
      handleGetCurrentUserInfo: async () => {
        try {
          const { data } = await fetchers.userFind()
          set(() => ({ user: data.user }))
        }
        catch {
          get().handleClear()
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
        return Object.fromEntries(Object.entries(state).filter(([key]) => !['loadingGetCurrentUserInfo'].includes(key)))
      },
    },
  ),
)

export { useUserStore }
