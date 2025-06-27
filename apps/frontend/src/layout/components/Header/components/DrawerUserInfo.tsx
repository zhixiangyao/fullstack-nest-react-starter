import type { DescriptionsProps } from 'antd'
import type { Dispatch } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Descriptions, Drawer } from 'antd'
import React, { useMemo } from 'react'
import { FormatOptions, formatTime } from 'utils'

import { TagRoleType } from '~/components/TagRoleType'
import { useUserStore } from '~/stores/useUserStore'

interface Props {
  open: boolean
  setOpen: Dispatch<boolean>
}

function DrawerUserInfo({ open, setOpen }: Props) {
  const { user } = useUserStore()

  const handleClose = useMemoizedFn(() => {
    setOpen(false)
  })

  const items = useMemo<DescriptionsProps['items']>(
    () => [
      {
        key: '1',
        label: 'Username',
        children: user?.username,
        span: 2,
      },
      {
        key: '2',
        label: 'Role',
        children: (
          <div className="flex gap-1 items-center">
            {user?.roles.map(role => (
              <TagRoleType value={role.name} key={role.id} />
            ))}
          </div>
        ),
        span: 1,
      },
      {
        key: '3',
        label: 'Created At',
        children: user ? formatTime(user.createdAt, FormatOptions.YYYY_MM_DD_HH_mm_ss) : '/',
        span: 3,
      },
      {
        key: '3',
        label: 'Update At',
        children: user ? formatTime(user.updatedAt, FormatOptions.YYYY_MM_DD_HH_mm_ss) : '/',
        span: 3,
      },
      {
        key: '4',
        label: 'Last Login',
        children: user && user.lastLogin ? formatTime(user.lastLogin, FormatOptions.YYYY_MM_DD_HH_mm_ss) : '/',
        span: 3,
      },
    ],
    [user],
  )

  return (
    <Drawer
      title="User Info"
      placement="right"
      open={open}
      width={600}
      maskClosable={false}
      keyboard={false}
      onClose={handleClose}
    >
      <Descriptions bordered size="middle" items={items} />
    </Drawer>
  )
}

export { DrawerUserInfo }
