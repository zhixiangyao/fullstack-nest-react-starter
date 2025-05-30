import type { FormItemProps } from 'antd'
import type { CreateRequest, LoginRequest } from '~/fetchers'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { App as AntdApp, Button, Checkbox, Form, Input, Segmented } from 'antd'
import React, { useCallback, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { useUserStore } from '~/stores/useUserStore'

type TFieldType = LoginRequest & CreateRequest

type TAuthType = 'Login' | 'Register'

const rules = {
  username: [{ required: true, message: '请输入您的 username!' }],
  password: [{ required: true, message: '请输入您的 password!' }],
} satisfies Record<string, FormItemProps['rules']>

function Auth() {
  const { remember, loading, token, user, handleLogin, handleCreate, handleRemember } = useUserStore()
  const { message } = AntdApp.useApp()
  const [authType, setAuthType] = useState<TAuthType>('Login')

  const handleFinish = useCallback(
    async ({ username, password }: TFieldType) => {
      try {
        if (username === undefined || password === undefined)
          return

        if (authType === 'Login')
          await handleLogin({ username, password })
        if (authType === 'Register') {
          await handleCreate({ username, password }, (e) => {
            message.success(e.message)
          })
        }
      }
      catch {}
    },
    [authType, handleCreate, handleLogin, message],
  )

  if (token) {
    return <Navigate replace to="/" />
  }

  return (
    <main className="flex h-full flex-col items-center pt-60 gap-6">
      <Segmented<TAuthType>
        options={['Login', 'Register']}
        value={authType}
        onChange={setAuthType}
        className="select-none"
      />
      <Form<TFieldType>
        name="login"
        className="w-72"
        onFinish={handleFinish}
        initialValues={{ username: user?.username ?? '' }}
      >
        <Form.Item<TFieldType> name="username" rules={rules.username}>
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>

        <Form.Item<TFieldType> name="password" rules={rules.password}>
          <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
        </Form.Item>

        <Form.Item>
          <Form.Item valuePropName="checked" noStyle>
            <Checkbox className="select-none" checked={remember} onChange={e => handleRemember(e.target.checked)}>
              记住我
            </Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button className="w-full select-none" type="primary" htmlType="submit" loading={loading}>
            {authType === 'Login' && '登录'}
            {authType === 'Register' && '注册'}
          </Button>
        </Form.Item>
      </Form>
    </main>
  )
}

export { Auth }
