import { Space } from 'antd'
import React, { memo } from 'react'

interface Props {}

export const UserPageHeader = memo<Props>(() => {
  return (
    <Space className="mb-5 w-full justify-between">
      <Space>&nbsp;</Space>
    </Space>
  )
})
UserPageHeader.displayName = 'UserPageHeader'
