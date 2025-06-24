import type { User } from '~/fetchers'
import { useMemoizedFn, useRequest } from 'ahooks'
import { App as AntdApp, Form } from 'antd'
import { useCallback, useEffect, useState } from 'react'

import * as fetchers from '~/fetchers'
import { CACHE_KEY_USER_FIND_ALL } from './useUserList'

export function useDrawerEdit() {
  const { message } = AntdApp.useApp()
  const { loading: loadingUpdate, runAsync } = useRequest(fetchers.userUpdate, {
    manual: true,
  })
  const { refreshAsync } = useRequest(fetchers.userFindAll, {
    cacheKey: CACHE_KEY_USER_FIND_ALL,
    manual: true,
  })
  const [form] = Form.useForm<User>()
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

  const handleFinish = useCallback(
    async (values: User) => {
      if (!user)
        return

      try {
        await runAsync({
          username: user?.username,
          email: values.email,
          isActive: values.isActive,
        })
        refreshAsync()
        handleClose()
        message.success('Edit successful!')
      }
      catch (error) {
        console.log(error)
      }
    },
    [handleClose, message, refreshAsync, runAsync, user],
  )

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        isActive: user.isActive,
      })
    }
  }, [user, form])

  return {
    user,
    form,
    open,
    loading,
    loadingUpdate,
    handleClose,
    handleOpen,
    handleFinish,
  }
}
