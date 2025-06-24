import type { User } from '~/fetchers'
import { useState } from 'react'

import * as fetchers from '~/fetchers'

export function useDrawerEdit() {
  const [user, setUser] = useState<User>()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleOpen(username: User['username']) {
    try {
      setLoading(true)
      setOpen(true)

      const user = await fetchers.userFind({ username })
      setUser(user.data.user)
    }
    finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setUser(void 0)
    setOpen(false)
  }

  return {
    user,
    open,
    loading,
    handleClose,
    handleOpen,
  }
}
