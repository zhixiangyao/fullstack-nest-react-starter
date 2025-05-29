import type { MenuProps } from 'antd'
import { HeartTwoTone } from '@ant-design/icons'
import { Menu } from 'antd'
import React, { memo, useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { stringCapitalization } from 'utils'

import { routes } from '~/router'
import { useAppStore } from '~/stores/useAppStore'
import { useUserStore } from '~/stores/useUserStore'

interface Props {}

const Nav = memo<Props>(() => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const appStore = useAppStore()
  const { user } = useUserStore()

  const handleMenuClick = useCallback<NonNullable<MenuProps['onClick']>>(
    ({ key }) => {
      pathname !== key && navigate(key)
    },
    [navigate, pathname],
  )

  const menus = useMemo(
    () =>
      routes
        .filter(route => route.roles.some(role => user?.roles.includes(role)))
        .map(({ path, label, icon }) => ({ key: path, label, icon })),
    [user?.roles],
  )

  return (
    <nav className="min-h-screen">
      <div className="sticky top-0 z-[1] flex h-[70px] w-full cursor-pointer select-none items-center justify-center">
        <HeartTwoTone className="text-xl" />
      </div>

      <div className="absolute bottom-20 w-full text-center text-white opacity-20 transition-all duration-[0.2s] ease-[ease]">
        {stringCapitalization(import.meta.env.VITE_APP_NODE_ENV.slice(0, 3))}
      </div>

      <Menu
        mode="inline"
        className="!border-transparent"
        items={menus}
        forceSubMenuRender={false}
        selectedKeys={[pathname]}
        onClick={handleMenuClick}
        inlineCollapsed={appStore.sizes[0] === 80}
      />
    </nav>
  )
})
Nav.displayName = 'Nav'

export { Nav }
