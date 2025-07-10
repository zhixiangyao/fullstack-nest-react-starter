import type { MenuProps } from 'antd'
import { LogoutOutlined, MoonOutlined, SunOutlined, UserOutlined } from '@ant-design/icons'
import { useMemoizedFn } from 'ahooks'
import { App as AntdApp, Avatar, Dropdown, theme } from 'antd'
import { useMemo, useState } from 'react'

import { useAppStore } from '~/stores/useAppStore'
import { useUserStore } from '~/stores/useUserStore'

import { DrawerUserInfo } from './components/DrawerUserInfo'
import { Tabs } from './components/Tabs'

const MenuKey = {
  THEME_LIGHT: 'THEME_LIGHT',
  THEME_DARK: 'THEME_DARK',
  USER_INFO: 'USER_INFO',
  LOGOUT: 'LOGOUT',
} as const

const items: MenuProps['items'] = [
  {
    label: 'Light Theme',
    key: MenuKey.THEME_LIGHT,
    icon: <SunOutlined />,
  },
  {
    label: 'Dark Theme',
    key: MenuKey.THEME_DARK,
    icon: <MoonOutlined />,
  },
  {
    label: 'User Info',
    key: MenuKey.USER_INFO,
    icon: <UserOutlined />,
  },
  {
    label: 'Logout',
    key: MenuKey.LOGOUT,
    icon: <LogoutOutlined />,
  },
]

function Header() {
  const { token } = theme.useToken()
  const appStore = useAppStore()
  const [open, setOpen] = useState(false)
  const { user, handleLogout } = useUserStore()
  const { message } = AntdApp.useApp()

  const handleMenuClick = useMemoizedFn<NonNullable<MenuProps['onClick']>>((e) => {
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
  })

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
        <Tabs />

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
