import type { DescriptionsProps } from 'antd'
import { Descriptions, Drawer } from 'antd'
import React, { memo, useCallback, useMemo } from 'react'
import { FormatOptions, formatTime } from 'utils'

import { TagRoleType } from '~/components/TagRoleType'
import { useUserStore } from '~/stores/useUserStore'

interface Props {
  open: boolean
  setOpen: React.Dispatch<boolean>
}

const DrawerUserInfo = memo<Props>(({ open, setOpen }) => {
  const { user } = useUserStore()

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const items = useMemo<DescriptionsProps['items']>(
    () => [
      {
        key: '1',
        label: '用户名',
        children: user?.username,
        span: 2,
      },
      {
        key: '2',
        label: '角色',
        children: <div className="flex gap-1 items-center">{user?.roles.map(role => <TagRoleType value={role.name} key={role.id} />)}</div>,
        span: 1,
      },
      {
        key: '3',
        label: '创建于',
        children: user ? formatTime(user.createdAt, FormatOptions.YYYY_MM_DD_HH_mm_ss) : '/',
        span: 3,
      },
      {
        key: '3',
        label: '更新于',
        children: user ? formatTime(user.updatedAt, FormatOptions.YYYY_MM_DD_HH_mm_ss) : '/',
        span: 3,
      },
      {
        key: '4',
        label: '上一次登录',
        children: user && user.lastLogin ? formatTime(user.lastLogin, FormatOptions.YYYY_MM_DD_HH_mm_ss) : '/',
        span: 3,
      },
    ],
    [user],
  )

  return (
    <Drawer width={600} title="用户信息" placement="right" onClose={handleClose} open={open}>
      <Descriptions bordered size="middle" items={items} />
    </Drawer>
  )
})
DrawerUserInfo.displayName = 'DrawerUserInfo'

export { DrawerUserInfo }
