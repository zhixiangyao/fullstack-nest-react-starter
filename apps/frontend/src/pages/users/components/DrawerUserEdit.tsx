import type { User } from '~/fetchers'
import { useRequest } from 'ahooks'
import { App as AntdApp, Button, Drawer, Form, Input, Switch } from 'antd'
import React, { useCallback, useEffect } from 'react'

import * as fetchers from '~/fetchers'

import { useDrawerUserEdit } from '../hooks/useDrawerUserEdit'
import { CACHE_KEY_USER_FIND_ALL } from '../hooks/useUserList'

type TFieldUser = User

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

function DrawerUserEdit() {
  const { message } = AntdApp.useApp()
  const drawerUserEdit = useDrawerUserEdit()
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
      if (!drawerUserEdit.user)
        return

      try {
        await runAsync({
          username: drawerUserEdit.user?.username,
          email: values.email,
          isActive: values.isActive,
        })
        refreshAsync()
        drawerUserEdit.handleClose()
        message.success('Edit successful!')
      }
      catch (error) {
        console.log(error)
      }
    },
    [drawerUserEdit, message, refreshAsync, runAsync],
  )

  useEffect(() => {
    if (drawerUserEdit.user) {
      form.setFieldsValue({
        username: drawerUserEdit.user.username,
        email: drawerUserEdit.user.email,
        isActive: drawerUserEdit.user.isActive,
      })
    }
  }, [drawerUserEdit.user, form])

  return (
    <Drawer
      width={700}
      title="Edit User"
      placement="right"
      onClose={drawerUserEdit.handleClose}
      open={drawerUserEdit.open}
      loading={drawerUserEdit.loading}
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
            disabled={drawerUserEdit.user?.roles.map(role => role.name).includes('ADMIN')}
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export { DrawerUserEdit }
export type { TFieldUser }
