import type { User } from '~/fetchers'
import { useRequest } from 'ahooks'
import { App as AntdApp, Button, Drawer, Form, Input, Switch } from 'antd'
import React, { useCallback, useEffect } from 'react'

import * as fetchers from '~/fetchers'

import { useDrawerUserEdit } from '../hooks/useDrawerUserEdit'
import { CACHE_KEY_GET_USER_LIST } from '../hooks/useUserList'

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
    cacheKey: CACHE_KEY_GET_USER_LIST,
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
        message.success('编辑成功')
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
      title="编辑用户"
      placement="right"
      onClose={drawerUserEdit.handleClose}
      open={drawerUserEdit.open}
      loading={drawerUserEdit.loading}
      footer={(
        <Button type="primary" onClick={form.submit} loading={loadingUpdate}>
          确定
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
        <Form.Item<TFieldUser> label="用户名" name="username">
          <Input disabled />
        </Form.Item>

        <Form.Item<TFieldUser> label="邮箱" name="email">
          <Input />
        </Form.Item>

        <Form.Item<TFieldUser> label="状态" name="isActive">
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            disabled={drawerUserEdit.user?.roles.map(role => role.name).includes('ADMIN')}
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export { DrawerUserEdit }
export type { TFieldUser }
