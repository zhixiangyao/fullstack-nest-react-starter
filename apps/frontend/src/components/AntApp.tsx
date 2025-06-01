import type { AppProps } from 'antd'
import { App, theme } from 'antd'
import React from 'react'

const message: AppProps['message'] = { maxCount: 1 }

interface Props {
  children: React.ReactNode
}

function AntApp({ children }: Props) {
  const { token } = theme.useToken()

  return (
    <App message={message} className="min-w-full min-h-full" style={{ backgroundColor: token.colorBgContainer }}>
      {children}
    </App>
  )
}

export { AntApp }
