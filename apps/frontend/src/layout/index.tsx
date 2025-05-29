import { Splitter } from 'antd'
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { Progress } from '~/components/Progress'
import { Spinning } from '~/components/Spinning'
import { Header } from '~/layout/components/Header'
import { Login } from '~/layout/components/Login'
import { Main } from '~/layout/components/Main'
import { Nav } from '~/layout/components/Nav'
import { Register } from '~/layout/components/Register'
import { useAppStore } from '~/stores/useAppStore'
import { useUserStore } from '~/stores/useUserStore'

function Layout() {
  const location = useLocation()
  const appStore = useAppStore()
  const { token, loaded, handleGetCurrentUserInfo } = useUserStore()
  const [pathname, setPathname] = useState('/')

  const isAnimating = location.pathname !== pathname

  useEffect(() => {
    setPathname(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    handleGetCurrentUserInfo()
  }, [handleGetCurrentUserInfo, token])

  if (!token) {
    return <>{appStore.state === 'login' ? <Login /> : <Register />}</>
  }

  if (!loaded) {
    return <Spinning />
  }

  if (location.pathname === '/') {
    return <Navigate replace to="/home" />
  }

  return (
    <>
      <Progress isAnimating={isAnimating} />

      <Splitter onResize={appStore.handleSizes}>
        <Splitter.Panel size={appStore.sizes[0]} min={80} max={400} className="!p-0" collapsible>
          <Nav />
        </Splitter.Panel>

        <Splitter.Panel size={appStore.sizes[1]}>
          <Header />

          <Main />
        </Splitter.Panel>
      </Splitter>
    </>
  )
}

export { Layout }
