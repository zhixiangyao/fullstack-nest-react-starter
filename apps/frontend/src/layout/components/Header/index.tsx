import type { MenuProps } from 'antd'
import { LogoutOutlined, MoonOutlined, SunOutlined, UserOutlined } from '@ant-design/icons'
import { App as AntdApp, Avatar, Dropdown, theme } from 'antd'
import React, { useCallback, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { stringCapitalization } from 'utils'

import { useAppStore } from '~/stores/useAppStore'

import { useUserStore } from '~/stores/useUserStore'
import { DrawerUserInfo } from './components/DrawerUserInfo'

const MenuKey = {
  THEME_LIGHT: 'THEME_LIGHT',
  THEME_DARK: 'THEME_DARK',
  USER_INFO: 'USER_INFO',
  LOGOUT: 'LOGOUT',
} as const

const items: MenuProps['items'] = [
  {
    label: '默认主题',
    key: MenuKey.THEME_LIGHT,
    icon: <SunOutlined />,
  },
  {
    label: '暗黑主题',
    key: MenuKey.THEME_DARK,
    icon: <MoonOutlined />,
  },
  {
    label: '用户信息',
    key: MenuKey.USER_INFO,
    icon: <UserOutlined />,
  },
  {
    label: '退出',
    key: MenuKey.LOGOUT,
    icon: <LogoutOutlined />,
  },
]

function Header() {
  const { token } = theme.useToken()
  const appStore = useAppStore()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const { user, handleLogout } = useUserStore()
  const { message } = AntdApp.useApp()

  const handleMenuClick = useCallback<NonNullable<MenuProps['onClick']>>(
    (e) => {
      switch (e.key) {
        case MenuKey.THEME_LIGHT:
          appStore.handleSwitchMode('light')
          break

        case MenuKey.THEME_DARK:
          appStore.handleSwitchMode('dark')
          break

        case MenuKey.USER_INFO:
          setOpen(true)
          break

        case MenuKey.LOGOUT:
          message.success('Logout.')
          handleLogout()
          break
      }
    },
    [appStore, message, handleLogout],
  )

  const title = useMemo(() => {
    const list = pathname.split('/').pop()?.split('-')

    return list?.map(str => stringCapitalization(str)).join(' ')
  }, [pathname])

  const menuProps = useMemo(
    () => ({
      items,
      onClick: handleMenuClick,
    }),
    [handleMenuClick],
  )

  return (
    <>
      <header
        className="flex h-10 w-full items-center justify-between px-3"
        style={{ backgroundColor: token.colorBgContainerDisabled }}
      >
        <span className="font-700 text-[20px]">{title}</span>

        <div className="flex items-center">
          <span className="mr-2 select-none">{user?.username}</span>

          <Dropdown menu={menuProps}>
            <Avatar size="small" icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </header>

      <DrawerUserInfo open={open} setOpen={setOpen} />
    </>
  )
}
export { Header }
