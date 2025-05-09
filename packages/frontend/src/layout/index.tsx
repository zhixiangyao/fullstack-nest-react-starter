import { Layout as AntdLayout } from 'antd'
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { Progress } from '~/components/Progress'
import { Spinning } from '~/components/Spinning'
import { useIsDesktop } from '~/hooks/useIsDesktop'
import { Header } from '~/layout/components/Header'
import { Login } from '~/layout/components/Login'
import { Main } from '~/layout/components/Main'
import { Nav } from '~/layout/components/Nav'
import { Register } from '~/layout/components/Register'
import { useAppStore } from '~/stores/useAppStore'
import { useUserStore } from '~/stores/useUserStore'

export function Layout() {
  const location = useLocation()
  const isDesktop = useIsDesktop()
  const { isLoginOrRegister } = useAppStore()
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
    return <>{isLoginOrRegister === 'login' ? <Login /> : <Register />}</>
  }

  if (!loaded) {
    return <Spinning />
  }

  if (location.pathname === '/') {
    return <Navigate replace to="/home" />
  }

  return (
    <AntdLayout>
      {!isDesktop && (
        <div className="fixed z-10 flex h-screen w-screen items-center justify-center bg-white text-center text-xl">
          请使用宽度大于 1024px 宽度大于 768px 的设备进行访问。
        </div>
      )}

      <Progress isAnimating={isAnimating} />

      <Nav />

      <AntdLayout.Content>
        <Header />

        <Main />
      </AntdLayout.Content>
    </AntdLayout>
  )
}
