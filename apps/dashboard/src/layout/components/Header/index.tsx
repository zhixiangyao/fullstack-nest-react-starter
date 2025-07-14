import type { MenuProps } from 'antd'
import {
  GithubOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  MenuOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useMemoizedFn } from 'ahooks'
import { App as AntdApp, Dropdown, theme } from 'antd'
import { useMemo, useState } from 'react'

import { useAppStore } from '~/stores/useAppStore'
import { useUserStore } from '~/stores/useUserStore'

import { DrawerProfile } from './components/DrawerProfile'
import { ModalAbout } from './components/ModalAbout'
import { Tabs } from './components/Tabs'

const MenuKey = {
  THEME_LIGHT: 'THEME_LIGHT',
  THEME_DARK: 'THEME_DARK',
  PROFIlE: 'PROFIlE',
  ABOUT: 'ABOUT',
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
    label: 'Profile',
    key: MenuKey.PROFIlE,
    icon: <UserOutlined />,
  },
  {
    label: 'About',
    key: MenuKey.ABOUT,
    icon: <InfoCircleOutlined />,
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
  const [openProfile, setOpenProfile] = useState(false)
  const [openAbout, setOpenAbout] = useState(false)
  const { handleLogout } = useUserStore()
  const { message } = AntdApp.useApp()

  const handleMenuClick = useMemoizedFn<NonNullable<MenuProps['onClick']>>((e) => {
    switch (e.key) {
      case MenuKey.THEME_LIGHT:
        appStore.handleSwitchMode('light')
        break

      case MenuKey.THEME_DARK:
        appStore.handleSwitchMode('dark')
        break

      case MenuKey.PROFIlE:
        setOpenProfile(true)
        break

      case MenuKey.ABOUT:
        setOpenAbout(true)
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

        <div className="flex gap-4 items-center">
          <GithubOutlined className="text-xl cursor-pointer" onClick={() => window.open('https://github.com/zhixiangyao/fullstack-nest-react-starter')} />

          <Dropdown menu={menuProps}>
            <MenuOutlined className="text-xl cursor-pointer" />
          </Dropdown>
        </div>
      </header>

      <DrawerProfile open={openProfile} setOpen={setOpenProfile} />
      <ModalAbout open={openAbout} setOpen={setOpenAbout} />
    </>
  )
}
export { Header }
