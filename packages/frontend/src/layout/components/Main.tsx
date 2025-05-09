import type { WatermarkProps } from 'antd'
import { Watermark } from 'antd'
import React, { memo } from 'react'
import { Outlet } from 'react-router-dom'

import { useUserStore } from '~/stores/useUserStore'

const watermarkConfig: WatermarkProps = {
  content: useUserStore.getState().user?.username,
  gap: [150, 150],
}

interface Props {}

export const Main = memo<Props>(() => {
  return (
    <Watermark
      className="h-[calc(100vh_-_50px)] w-full overflow-y-auto overflow-x-hidden px-3 pt-2"
      content={watermarkConfig.content}
      gap={watermarkConfig.gap}
    >
      <Outlet />
    </Watermark>
  )
})
Main.displayName = 'Main'
