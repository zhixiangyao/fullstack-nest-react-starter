import type { User } from '~/fetchers'
import { useMemoizedFn } from 'ahooks'
import { useState } from 'react'

import * as fetchers from '~/fetchers'

export function useDrawerEdit() {
  const [user, setUser] = useState<User>()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleOpen = useMemoizedFn(async (username: User['username']) => {
    try {
      setLoading(true)
      setOpen(true)

      const user = await fetchers.userFind({ username })
      setUser(user.data.user)
    }
    finally {
      setLoading(false)
    }
  })

  const handleClose = useMemoizedFn(() => {
    setUser(void 0)
    setOpen(false)
  })

  return {
    user,
    open,
    loading,
    handleClose,
    handleOpen,
  }
}
