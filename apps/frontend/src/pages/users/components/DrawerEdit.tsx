import type { User } from '~/fetchers'
import { useRequest } from 'ahooks'
import { App as AntdApp, Button, Drawer, Form, Input, Switch } from 'antd'
import React, { useCallback, useEffect } from 'react'

import * as fetchers from '~/fetchers'

import { CACHE_KEY_USER_FIND_ALL } from '../hooks/useUserList'

export type TFieldUser = User

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
}

interface Props {
  user?: User
  open: boolean
  loading: boolean
  handleClose: () => void
}

function DrawerEdit(props: Props) {
  const { user, open, loading } = props
  const { handleClose } = props
  const { message } = AntdApp.useApp()
  const { loading: loadingUpdate, runAsync } = useRequest(fetchers.userUpdate, {
    manual: true,
  })
  const { refreshAsync } = useRequest(fetchers.userFindAll, {
    cacheKey: CACHE_KEY_USER_FIND_ALL,
    manual: true,
  })
  const [form] = Form.useForm<TFieldUser>()

  const handleFinish = useCallback(
    async (values: TFieldUser) => {
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

  return (
    <Drawer
      width={700}
      title="Edit User"
      placement="right"
      onClose={handleClose}
      open={open}
      loading={loading}
      footer={(
        <Button type="primary" onClick={form.submit} loading={loadingUpdate}>
          Confirm
        </Button>
      )}
    >
      <Form<TFieldUser>
        {...formItemLayout}
        name="user-edit"
        autoComplete="off"
        onFinish={handleFinish}
        form={form}
        disabled={loadingUpdate}
      >
        <Form.Item<TFieldUser> label="Username" name="username">
          <Input disabled />
        </Form.Item>

        <Form.Item<TFieldUser> label="Email" name="email">
          <Input />
        </Form.Item>

        <Form.Item<TFieldUser> label="Active" name="isActive">
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Unactive"
            disabled={user?.roles.map(role => role.name).includes('ADMIN')}
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export { DrawerEdit }
