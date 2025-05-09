import type { ConfigProviderProps } from 'antd/es/config-provider'
import type { Rule } from 'antd/es/form'

export const getPopupContainerConfig: ConfigProviderProps['getPopupContainer'] = () => {
  return document.body
}

export const formConfig: ConfigProviderProps['form'] = {
  validateMessages: {
    required: '${label} 是必填项',
  },
}

export const rules = {
  username: [{ required: true, message: '请输入您的 username!' }] satisfies Rule[],
  password: [{ required: true, message: '请输入您的 password!' }] satisfies Rule[],
  time: [{ required: true, message: '请输入 time!' }] satisfies Rule[],
  description: [{ required: true, message: '请输入 description!' }] satisfies Rule[],
  title: [{ required: true, message: '请输入 title!' }] satisfies Rule[],
  href: [{ required: true, message: '请输入 href!' }] satisfies Rule[],
}
