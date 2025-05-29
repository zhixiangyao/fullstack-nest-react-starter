import type { MenuProps } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { App as AntdApp, Avatar, Dropdown } from 'antd'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { stringCapitalization } from 'utils'

import { useUserStore } from '~/stores/useUserStore'

import { DrawerUserInfo } from './components/DrawerUserInfo'

const items: MenuProps['items'] = [
  {
    label: '用户信息',
    key: '1',
  },
  {
    label: '退出',
    key: '2',
  },
]

interface Props {}

const Header = memo<Props>(() => {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const { user, handleLogout } = useUserStore()
  const { message } = AntdApp.useApp()

  const handleMenuClick = useCallback<NonNullable<MenuProps['onClick']>>(
    (e) => {
      switch (e.key) {
        case '1':
          setOpen(true)
          break

        case '2':
          message.success('Logout.')
          handleLogout()
          break

        default:
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
      <header className="flex h-[50px] w-full items-center justify-between bg-gray-200 px-3">
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
