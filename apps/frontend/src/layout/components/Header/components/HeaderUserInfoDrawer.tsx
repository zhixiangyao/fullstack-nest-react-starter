import type { DescriptionsProps } from 'antd'
import { Descriptions, Drawer } from 'antd'
import React, { memo, useCallback, useMemo } from 'react'
import { formatTime } from 'utils'

import { TagRoleType } from '~/components/TagRoleType'
import { useUserStore } from '~/stores/useUserStore'

interface Props {
  open: boolean
  setOpen: React.Dispatch<boolean>
}

export const HeaderUserInfoDrawer = memo<Props>(({ open, setOpen }) => {
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
        children: <TagRoleType value={user?.role} />,
        span: 1,
      },
      {
        key: '3',
        label: '创建于',
        children: user ? formatTime(user?.createdAt) : '',
        span: 3,
      },
      {
        key: '3',
        label: '更新于',
        children: user ? formatTime(user?.updatedAt) : '',
        span: 3,
      },
      {
        key: '4',
        label: '上一次登录',
        children: user ? formatTime(user?.lastLogin) : '',
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
HeaderUserInfoDrawer.displayName = 'HeaderUserInfoDrawer'
