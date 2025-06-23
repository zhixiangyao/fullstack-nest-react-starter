import type { User } from '~/fetchers'
import { create } from 'zustand'

import * as fetchers from '~/fetchers'

interface Store {
  user?: User
  open: boolean
  loading: boolean
  handleOpen: (username: string) => void
  handleClose: () => void
}

export const useDrawerUserEdit = create<Store>()(set => ({
  user: void 0,
  open: false,
  loading: false,

  handleOpen: async (username) => {
    try {
      set({ open: true, loading: true })

      const user = await fetchers.userFind({ username })
      set({ user: user.data.user })
    }
    finally {
      set({ loading: false })
    }
  },
  handleClose: () => set({ open: false, user: void 0 }),
}))
