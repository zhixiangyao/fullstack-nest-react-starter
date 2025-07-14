import type { AppProps } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import { App, theme } from 'antd'
import { useMemo } from 'react'

const message: AppProps['message'] = { maxCount: 1 }

interface Props {
  children: ReactNode
}

function AntApp({ children }: Props) {
  const { token } = theme.useToken()
  const style = useMemo<CSSProperties>(() => ({ backgroundColor: token.colorBgContainer }), [token.colorBgContainer])

  return (
    <App message={message} className="min-w-full min-h-full" style={style}>
      {children}
    </App>
  )
}

export { AntApp }
