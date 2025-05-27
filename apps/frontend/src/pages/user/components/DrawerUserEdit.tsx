import type { TUser } from '~/fetchers'
import { useRequest } from 'ahooks'
import { App as AntdApp, Button, Drawer, Form, Input, Switch } from 'antd'
import React, { memo, useCallback, useEffect } from 'react'
import { EnumRole, EnumStatus } from '~/fetchers'
import * as fetchers from '~/fetchers'
import { useDrawerUserEdit } from '../hooks/useDrawerUserEdit'
import { CACHE_KEY_GET_USER_LIST } from '../hooks/useUserList'

export type TFieldUser = Omit<TUser, 'status'> & { status: boolean }

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

export const DrawerUserEdit = memo(() => {
  const { message } = AntdApp.useApp()
  const drawerUserEdit = useDrawerUserEdit()
  const { loading, runAsync } = useRequest(fetchers.update, {
    manual: true,
  })
  const { refreshAsync } = useRequest(fetchers.findAll, {
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
          status: values.status ? EnumStatus.Active : EnumStatus.Inactive,
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
        status: drawerUserEdit.user.status === EnumStatus.Active,
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
        <Button type="primary" onClick={form.submit} loading={loading}>
          确定
        </Button>
      )}
    >
      <Form<TFieldUser>
        {...formItemLayout}
        name="edit-user"
        autoComplete="off"
        onFinish={handleFinish}
        form={form}
        disabled={loading}
      >
        <Form.Item<TFieldUser> label="用户名" name="username">
          <Input disabled />
        </Form.Item>

        <Form.Item<TFieldUser> label="邮箱" name="email">
          <Input />
        </Form.Item>

        <Form.Item<TFieldUser> label="状态" name="status">
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            disabled={drawerUserEdit.user?.roles.includes(EnumRole.ADMIN)}
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
})
DrawerUserEdit.displayName = 'DrawerUserEdit'
