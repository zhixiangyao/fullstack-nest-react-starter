import type { User } from '~/fetchers'
import { useMemoizedFn } from 'ahooks'
import { App as AntdApp, Form } from 'antd'
import { useState } from 'react'

import * as fetchers from '~/fetchers'

function useDrawerEdit() {
  const { message } = AntdApp.useApp()
  const [form] = Form.useForm<User>()
  const [user, setUser] = useState<User>()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingConfirm, setLoadingConfirm] = useState(false)

  const handleOpenEdit = useMemoizedFn(async (username: User['username']) => {
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

  const handleFinish = useMemoizedFn(async (values: User, cb: () => void) => {
    if (!user)
      return

    try {
      setLoadingConfirm(true)
      await fetchers.userUpdate({
        username: user?.username,
        email: values.email,
        isActive: values.isActive,
      })
      message.success('Edit successful!')
      cb()
      handleClose()
    }
    finally {
      setLoadingConfirm(false)
    }
  })

  return {
    user,
    form,
    open,
    loading,
    loadingConfirm,
    handleClose,
    handleOpenEdit,
    handleFinish,
  }
}

export { useDrawerEdit }

export type TUseDrawerEditReturnType = ReturnType<typeof useDrawerEdit>
