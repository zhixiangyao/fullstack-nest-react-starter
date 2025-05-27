import { create } from 'zustand'

interface Store {
  uuid?: string
  open: boolean
  handleOpen: (uuid: string) => void
  handleClose: () => void
}

export const useDrawerUserEdit = create<Store>()(set => ({
  uuid: void 0,
  open: false,

  handleOpen: uuid => set({ open: true, uuid }),
  handleClose: () => set({ open: false }),
}))
