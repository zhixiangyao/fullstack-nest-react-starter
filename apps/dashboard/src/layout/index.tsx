import { Splitter } from 'antd'
import { Navigate, useLocation } from 'react-router-dom'

import { Container } from '~/layout/components/Container'
import { Header } from '~/layout/components/Header'
import { Main } from '~/layout/components/Main'
import { Nav } from '~/layout/components/Nav'
import { useAppStore } from '~/stores/useAppStore'
import { useUserStore } from '~/stores/useUserStore'

function Layout() {
  const location = useLocation()
  const appStore = useAppStore()
  const userStore = useUserStore()
  const { leftWidth, rightWidth } = appStore
  const { handleSplitterSizes } = appStore

  if (!userStore.token) {
    return <Navigate replace to="/auth" />
  }

  if (location.pathname === '/') {
    return <Navigate replace to="/home" />
  }

  return (
    <Container>
      <Splitter onResize={handleSplitterSizes}>
        <Splitter.Panel size={leftWidth} min={80} max={320} className="!p-0" collapsible>
          <Nav />
        </Splitter.Panel>

        <Splitter.Panel size={rightWidth}>
          <Header />

          <Main />
        </Splitter.Panel>
      </Splitter>
    </Container>
  )
}

export { Layout }
