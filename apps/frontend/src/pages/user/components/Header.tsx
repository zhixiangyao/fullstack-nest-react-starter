import { Space } from 'antd'
import React, { memo } from 'react'

interface Props {}

export const Header = memo<Props>(() => {
  return (
    <Space className="mb-2 w-full justify-between">
      <Space>TODO</Space>
    </Space>
  )
})
Header.displayName = 'Header'
