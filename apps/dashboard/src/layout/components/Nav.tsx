import type { MenuProps } from 'antd'
import { useMemoizedFn } from 'ahooks'
import { Avatar, Menu } from 'antd'
import clsx from 'clsx'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { stringCapitalization } from 'utils'

import { genMenus } from '~/router'
import { useAppStore } from '~/stores/useAppStore'
import { useUserStore } from '~/stores/useUserStore'

function Nav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const appStore = useAppStore()
  const { user } = useUserStore()
  const collapsed = appStore.leftWidth === 80
  const menus = useMemo(() => genMenus(user?.roles.map(role => role.name) ?? []), [user?.roles])

  const handleMenuClick = useMemoizedFn<NonNullable<MenuProps['onClick']>>(
    ({ key }) => pathname !== key && navigate(key),
  )

  const handleAvatarClick = useMemoizedFn(() => {
    const leftWidth = appStore.leftWidth >= 200 ? 80 : 320
    appStore.handleSplitterSizes([leftWidth, (appStore.size?.width ?? 0) - leftWidth])
  })

  return (
    <nav className="min-h-screen relative">
      <div
        className="sticky top-0 z-[1] flex h-[70px] w-full cursor-pointer select-none items-center justify-center"
        onDoubleClick={handleAvatarClick}
      >
        <Avatar src={user?.avatar ?? void 0}>{!user?.avatar ? user?.username : null}</Avatar>
      </div>

      <div
        className={clsx(
          collapsed ? 'text-[35px] leading-[35px]' : 'text-[50px] leading-[50px]',
          'absolute bottom-20 w-full text-center opacity-20 transition-all duration-[0.2s] ease-[ease]',
        )}
      >
        {stringCapitalization(import.meta.env.MODE)?.slice(0, 3)}
      </div>

      <Menu
        mode="inline"
        className="!border-transparent"
        items={menus}
        forceSubMenuRender={false}
        selectedKeys={[pathname]}
        onClick={handleMenuClick}
        inlineCollapsed={collapsed}
      />
    </nav>
  )
}

export { Nav }
