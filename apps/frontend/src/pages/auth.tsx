import type { FormItemProps } from 'antd'
import type { UserCreateRequest, UserLoginRequest } from '~/fetchers'
import { CloudOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { useMemoizedFn } from 'ahooks'
import { App as AntdApp, Button, Checkbox, Form, Input, Segmented } from 'antd'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { Rain } from '~/components/Rain'
import { useUserStore } from '~/stores/useUserStore'

type TFieldType = UserLoginRequest & UserCreateRequest

type TAuthType = 'Login' | 'Register'

const rules = {
  username: [{ required: true, message: 'Please enter your username!' }],
  password: [{ required: true, message: 'Please enter your password!' }],
  email: [],
} satisfies Record<string, FormItemProps['rules']>

function useAuth() {
  const { user, handleLogin, handleCreate } = useUserStore()
  const [loading, setLoading] = useState(false)
  const { message } = AntdApp.useApp()
  const [form] = Form.useForm<TFieldType>()
  const [authType, setAuthType] = useState<TAuthType>('Login')
  const background = authType === 'Login' ? '/image1.png' : '/image2.png'

  const handleFinish = useMemoizedFn(async (values: TFieldType) => {
    if (values.username === undefined || values.password === undefined)
      return

    try {
      setLoading(true)

      if (authType === 'Login')
        await handleLogin(values)
      if (authType === 'Register') {
        await handleCreate(values, (e) => {
          message.success(e.message)
        })
      }
    }
    finally {
      setLoading(false)
    }
  })

  const handleInjectForm = useMemoizedFn(() => {
    form.setFieldsValue({
      username: authType === 'Login' ? user?.username ?? '' : '',
      password: '',
    })
  })

  useEffect(handleInjectForm, [handleInjectForm])

  return {
    loading,
    form,
    authType,
    background,
    setAuthType,
    handleFinish,
  }
}

function Auth() {
  const { token, remember, handleRemember } = useUserStore()
  const auth = useAuth()

  if (token) {
    return <Navigate replace to="/" />
  }

  return (
    <main className="flex h-full w-full flex-col items-center pt-60 gap-6">
      <Rain background={auth.background} />

      <Segmented<TAuthType>
        options={['Login', 'Register']}
        value={auth.authType}
        onChange={auth.setAuthType}
        className="select-none z-10"
      />
      <Form<TFieldType> name="auth" autoComplete="off" className="w-72 z-10" form={auth.form} onFinish={auth.handleFinish}>
        <Form.Item<TFieldType> name="username" rules={rules.username}>
          <Input prefix={<UserOutlined />} placeholder="Please enter the username." />
        </Form.Item>

        <Form.Item<TFieldType> name="password" rules={rules.password}>
          <Input.Password prefix={<LockOutlined />} placeholder="Please enter the password." />
        </Form.Item>

        {auth.authType === 'Login' && (
          <Form.Item>
            <Form.Item valuePropName="checked" noStyle>
              <Checkbox
                className="select-none !text-gray-200"
                checked={remember}
                onChange={e => handleRemember(e.target.checked)}
              >
                Remember me
              </Checkbox>
            </Form.Item>
          </Form.Item>
        )}

        {auth.authType === 'Register' && (
          <Form.Item<TFieldType> name="email" rules={rules.email}>
            <Input prefix={<CloudOutlined />} placeholder="Please enter your email address." />
          </Form.Item>
        )}

        <Form.Item>
          <Button className="w-full select-none" type="primary" htmlType="submit" loading={auth.loading}>
            {auth.authType}
          </Button>
        </Form.Item>
      </Form>
    </main>
  )
}

export { Auth }
