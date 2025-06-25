import type { User } from '~/fetchers'
import { useMemoizedFn, useRequest } from 'ahooks'
import { App as AntdApp, Form } from 'antd'
import { useState } from 'react'

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

      const { data } = await fetchers.userFind({ username })
      setUser(data.user)
      form.setFieldsValue({
        username: data.user.username,
        email: data.user.email,
        isActive: data.user.isActive,
      })
    }
    finally {
      setLoading(false)
    }
  })

  const handleClose = useMemoizedFn(() => {
    form.resetFields()
    setUser(void 0)
    setOpen(false)
  })

  const handleFinish = useMemoizedFn(async (values: User) => {
    if (!user)
      return

    try {
      await runAsync({
        username: user?.username,
        email: values.email,
        isActive: values.isActive,
      })
      message.success('Edit successful!')
      refreshAsync()
      handleClose()
    }
    catch (error) {
      console.log(error)
    }
  })

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

export type TUseDrawerEditReturnType = ReturnType<typeof useDrawerEdit>
