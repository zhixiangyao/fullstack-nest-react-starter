import type { ConfigOptions } from 'antd/es/message/interface'
import { App as AntdApp, ConfigProvider } from 'antd'
import React from 'react'

import { Router } from '~/router'
import { formConfig, getPopupContainerConfig } from '~/utils/ant'

import '~/styles/global.css'

const message: ConfigOptions = { maxCount: 1 }

export function App() {
  return (
    <ConfigProvider form={formConfig} getPopupContainer={getPopupContainerConfig}>
      <AntdApp message={message}>
        <Router />
      </AntdApp>
    </ConfigProvider>
  )
}
