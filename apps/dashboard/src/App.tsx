import { useMount, useSize } from 'ahooks'
import { useEffect } from 'react'

import { AntApp } from '~/components/AntApp'
import { AntConfigProvider } from '~/components/AntConfigProvider'
import { Router } from '~/router'
import { useAppStore } from '~/stores/useAppStore'
import { useUserStore } from '~/stores/useUserStore'

import './styles/app.css'

function App() {
  const { handleWindowSize } = useAppStore()
  const { token, handleGetCurrentUserInfo } = useUserStore()
  const size = useSize(document.querySelector('#root'))

  useEffect(() => size && handleWindowSize(size), [handleWindowSize, size])

  useMount(() => token && handleGetCurrentUserInfo())

  return (
    <AntConfigProvider>
      <AntApp>
        <Router />
      </AntApp>
    </AntConfigProvider>
  )
}

export { App }
