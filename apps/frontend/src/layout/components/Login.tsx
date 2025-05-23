import type { Rule } from 'antd/es/form'
import type { LoginRequest } from '~/fetchers/type'
import { LockOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons'
import { Layout as AntdLayout, Button, Checkbox, Form, Input } from 'antd'

import clsx from 'clsx'
import React, { memo, useCallback } from 'react'
import { useAppStore } from '~/stores/useAppStore'

import { useUserStore } from '~/stores/useUserStore'

type FieldType = LoginRequest

export const rules = {
  username: [{ required: true, message: '请输入您的 username!' }] satisfies Rule[],
  password: [{ required: true, message: '请输入您的 password!' }] satisfies Rule[],
}

interface Props {
  className?: string
}

export const Login = memo<Props>(({ className }) => {
  const { handleSwitchLoginOrRegister } = useAppStore()
  const { remember, loading, user, handleLogin, handleRemember } = useUserStore()

  const handleFinish = useCallback(
    async ({ username, password }: FieldType) => {
      try {
        if (username === undefined || password === undefined)
          return

        await handleLogin({ username, password })
      }
      catch {}
    },
    [handleLogin],
  )

  return (
    <AntdLayout.Content className={clsx('flex h-full flex-col items-center pt-60', className)}>
      <div className="mb-8 text-8xl">
        <SafetyCertificateOutlined />
      </div>

      <Form<FieldType>
        name="login"
        className="w-72"
        wrapperCol={{}}
        onFinish={handleFinish}
        initialValues={{ username: user?.username ?? '' }}
      >
        <Form.Item<FieldType> name="username" rules={rules.username}>
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>

        <Form.Item<FieldType> name="password" rules={rules.password}>
          <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
        </Form.Item>

        <Form.Item>
          <Form.Item valuePropName="checked" noStyle>
            <Checkbox className="select-none" checked={remember} onChange={e => handleRemember(e.target.checked)}>
              记住我
            </Checkbox>
          </Form.Item>

          <a className="float-right select-none" onClick={handleSwitchLoginOrRegister}>
            注册
          </a>
        </Form.Item>

        <Form.Item>
          <Button className="w-full select-none" type="primary" htmlType="submit" loading={loading}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </AntdLayout.Content>
  )
})
Login.displayName = 'Login'
