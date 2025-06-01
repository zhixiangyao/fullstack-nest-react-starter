import type { ConfigProviderProps } from 'antd'
import { ConfigProvider } from 'antd'
import React from 'react'
import { useAppStore } from '~/stores/useAppStore'

const formConfig: ConfigProviderProps['form'] = {
  validateMessages: {
    required: '${label} 是必填项',
  },
}

const getPopupContainerConfig: ConfigProviderProps['getPopupContainer'] = () => {
  return document.body
}

interface Props {
  children: React.ReactNode
}

function AntConfigProvider({ children }: Props) {
  const appStore = useAppStore()

  return (
    <ConfigProvider theme={appStore.theme} form={formConfig} getPopupContainer={getPopupContainerConfig}>
      {children}
    </ConfigProvider>
  )
}

export { AntConfigProvider }
