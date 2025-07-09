import { useSize } from 'ahooks'
import { Spin, Splitter } from 'antd'
import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { Progress } from '~/components/Progress'
import { Header } from '~/layout/components/Header'
import { Main } from '~/layout/components/Main'
import { Nav } from '~/layout/components/Nav'
import { useAppStore } from '~/stores/useAppStore'
import { useUserStore } from '~/stores/useUserStore'

function Layout() {
  const location = useLocation()
  const appStore = useAppStore()
  const { leftWidth, rightWidth } = appStore
  const { handleWindowSize, handleSplitterSizes } = appStore
  const { token, loaded, handleGetCurrentUserInfo } = useUserStore()
  const [pathname, setPathname] = useState('/')
  const size = useSize(document.querySelector('#root'))
  const isAnimating = location.pathname !== pathname

  useEffect(() => {
    size && handleWindowSize(size)
  }, [handleWindowSize, size])

  useEffect(() => {
    setPathname(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    token && handleGetCurrentUserInfo()
  }, [handleGetCurrentUserInfo, token])

  if (!token) {
    return <Navigate replace to="/auth" />
  }

  if (!loaded) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spin spinning />
      </div>
    )
  }

  if (location.pathname === '/') {
    return <Navigate replace to="/home" />
  }

  return (
    <>
      <Progress isAnimating={isAnimating} />

      <Splitter onResize={handleSplitterSizes}>
        <Splitter.Panel size={leftWidth} min={80} max={400} className="!p-0" collapsible>
          <Nav />
        </Splitter.Panel>

        <Splitter.Panel size={rightWidth}>
          <Header />

          <Main />
        </Splitter.Panel>
      </Splitter>
    </>
  )
}

export { Layout }
