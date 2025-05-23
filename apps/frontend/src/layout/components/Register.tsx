import type { RegisterRequest } from '~/fetchers/type'
import { LockOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons'
import { Layout as AntdLayout, App, Button, Form, Input } from 'antd'
import clsx from 'clsx'

import React, { memo, useCallback } from 'react'
import { useAppStore } from '~/stores/useAppStore'
import { useUserStore } from '~/stores/useUserStore'

import { rules } from './Login'

type FieldType = RegisterRequest

interface Props {
  className?: string
}

export const Register = memo<Props>(({ className }) => {
  const { handleSwitchLoginOrRegister } = useAppStore()
  const { loading, handleRegister } = useUserStore()
  const { message } = App.useApp()

  const handleFinish = useCallback(
    async ({ username, password }: FieldType) => {
      try {
        if (username === undefined || password === undefined)
          return

        handleRegister({ username, password }, (e) => {
          handleSwitchLoginOrRegister()
          message.success(e.message)
        })
      }
      catch {}
    },
    [handleRegister, handleSwitchLoginOrRegister, message],
  )

  return (
    <AntdLayout.Content className={clsx('flex h-full flex-col items-center pt-60', className)}>
      <div className="mb-8 text-8xl">
        <SafetyCertificateOutlined />
      </div>

      <Form<FieldType> name="login" className="w-72" wrapperCol={{}} onFinish={handleFinish}>
        <Form.Item<FieldType> name="username" rules={rules.username}>
          <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item<FieldType> name="password" rules={rules.password}>
          <Input prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
        </Form.Item>

        <Form.Item>
          <a className="float-right select-none" onClick={handleSwitchLoginOrRegister}>
            登录
          </a>
        </Form.Item>

        <Form.Item>
          <Button className="w-full select-none" type="primary" htmlType="submit" loading={loading}>
            注册
          </Button>
        </Form.Item>
      </Form>
    </AntdLayout.Content>
  )
})
Register.displayName = 'Register'
