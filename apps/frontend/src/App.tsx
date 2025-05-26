import type { ConfigProviderProps } from 'antd/es/config-provider'
import type { ConfigOptions } from 'antd/es/message/interface'
import { App as AntdApp, ConfigProvider } from 'antd'
import React from 'react'

import { Router } from '~/router'

import '~/styles/global.css'

const message: ConfigOptions = { maxCount: 1 }
const formConfig: ConfigProviderProps['form'] = {
  validateMessages: {
    required: '${label} 是必填项',
  },
}
const getPopupContainerConfig: ConfigProviderProps['getPopupContainer'] = () => {
  return document.body
}

export function App() {
  return (
    <ConfigProvider form={formConfig} getPopupContainer={getPopupContainerConfig}>
      <AntdApp message={message}>
        <Router />
      </AntdApp>
    </ConfigProvider>
  )
}
