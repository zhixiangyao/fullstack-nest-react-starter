import type { ConfigProviderProps, ThemeConfig } from 'antd'
import type { ReactNode } from 'react'
import { ConfigProvider, theme } from 'antd'
import React, { useMemo } from 'react'

import { useAppStore } from '~/stores/useAppStore'

const { darkAlgorithm, defaultAlgorithm } = theme

const formConfig: ConfigProviderProps['form'] = {
  validateMessages: {
    required: '${label} 是必填项',
  },
}

const getPopupContainerConfig: ConfigProviderProps['getPopupContainer'] = () => {
  return document.body
}

interface Props {
  children: ReactNode
}

function AntConfigProvider({ children }: Props) {
  const appStore = useAppStore()
  const theme = useMemo<ThemeConfig>(
    () => ({
      token: appStore.token,
      algorithm: appStore.mode === 'dark' ? darkAlgorithm : defaultAlgorithm,
    }),
    [appStore.mode, appStore.token],
  )

  return (
    <ConfigProvider theme={theme} form={formConfig} getPopupContainer={getPopupContainerConfig}>
      {children}
    </ConfigProvider>
  )
}

export { AntConfigProvider }
