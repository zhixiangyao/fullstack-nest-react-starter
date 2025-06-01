import type { MenuProps } from 'antd'
import { LogoutOutlined, MoonOutlined, SunOutlined, UserOutlined } from '@ant-design/icons'
import { App as AntdApp, Avatar, Dropdown, theme } from 'antd'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { stringCapitalization } from 'utils'

import { useAppStore } from '~/stores/useAppStore'

import { useUserStore } from '~/stores/useUserStore'
import { DrawerUserInfo } from './components/DrawerUserInfo'

enum EnumMenuKey {
  THEME_LIGHT = 'THEME_LIGHT',
  THEME_DARK = 'THEME_DARK',
  USER_INFO = 'USER_INFO',
  LOGOUT = 'LOGOUT',
}

const items: MenuProps['items'] = [
  {
    label: '默认主题',
    key: EnumMenuKey.THEME_LIGHT,
    icon: <SunOutlined />,
  },
  {
    label: '暗黑主题',
    key: EnumMenuKey.THEME_DARK,
    icon: <MoonOutlined />,
  },
  {
    label: '用户信息',
    key: EnumMenuKey.USER_INFO,
    icon: <UserOutlined />,
  },
  {
    label: '退出',
    key: EnumMenuKey.LOGOUT,
    icon: <LogoutOutlined />,
  },
]

interface Props {}

const Header = memo<Props>(() => {
  const { token } = theme.useToken()
  const appStore = useAppStore()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const { user, handleLogout } = useUserStore()
  const { message } = AntdApp.useApp()

  const handleMenuClick = useCallback<NonNullable<MenuProps['onClick']>>(
    (e) => {
      switch (e.key) {
        case EnumMenuKey.THEME_LIGHT:
          appStore.handleSwitchLight()
          break

        case EnumMenuKey.THEME_DARK:
          appStore.handleSwitchDark()
          break

        case EnumMenuKey.USER_INFO:
          setOpen(true)
          break

        case EnumMenuKey.LOGOUT:
          message.success('Logout.')
          handleLogout()
          break
      }
    },
    [setOpen, handleLogout, message],
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
      <header className="flex h-10 w-full items-center justify-between px-3" style={{ backgroundColor: token.colorBgContainerDisabled }}>
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
})
Header.displayName = 'Header'

export { Header }
