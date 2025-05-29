import type { AppProps, ConfigProviderProps } from 'antd'
import { App as AntdApp, ConfigProvider } from 'antd'
import React from 'react'

import { Router } from '~/router'

import '~/styles/global.css'

const message: AppProps['message'] = { maxCount: 1 }
const formConfig: ConfigProviderProps['form'] = {
  validateMessages: {
    required: '${label} 是必填项',
  },
}
const getPopupContainerConfig: ConfigProviderProps['getPopupContainer'] = () => {
  return document.body
}

function App() {
  return (
    <ConfigProvider form={formConfig} getPopupContainer={getPopupContainerConfig}>
      <AntdApp message={message}>
        <Router />
      </AntdApp>
    </ConfigProvider>
  )
}

export { App }
