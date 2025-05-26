import type { MenuProps } from 'antd'
import { HeartTwoTone } from '@ant-design/icons'
import { Layout as AntdLayout, Menu } from 'antd'
import clsx from 'clsx'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { stringCapitalization } from 'utils'

import { useIsTablet } from '~/hooks/useIsTablet'
import { routes } from '~/router'
import { useAppStore } from '~/stores/useAppStore'
import { useUserStore } from '~/stores/useUserStore'

interface Props {}

export const Nav = memo<Props>(() => {
  const isTablet = useIsTablet()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { width, collapsed, handleCollapsed, handleDisable } = useAppStore()
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

  useEffect(() => {
    handleDisable(isTablet)
  }, [handleDisable, isTablet])

  return (
    <AntdLayout.Sider
      className="min-h-screen"
      width={width}
      collapsed={collapsed}
      collapsible
      onCollapse={isTablet ? undefined : handleCollapsed}
    >
      <div
        className="sticky top-0 z-[1] flex h-[70px] w-full cursor-pointer select-none items-center justify-center"
        onClick={isTablet ? undefined : handleCollapsed}
      >
        <HeartTwoTone className="text-xl" />
      </div>

      <div
        className={clsx(
          collapsed ? 'text-[40px] leading-[40px]' : 'text-[100px] leading-[100px]',
          'absolute bottom-20 w-full text-center text-white opacity-20 transition-all duration-[0.2s] ease-[ease]',
        )}
      >
        {stringCapitalization(import.meta.env.VITE_APP_NODE_ENV.slice(0, 3))}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        forceSubMenuRender={false}
        selectedKeys={[pathname]}
        onClick={handleMenuClick}
        items={menus}
      />
    </AntdLayout.Sider>
  )
})
Nav.displayName = 'Nav'
