import type { WatermarkProps } from 'antd'
import { Watermark } from 'antd'
import { useMemo } from 'react'
import { Outlet } from 'react-router-dom'

import { useUserStore } from '~/stores/useUserStore'

function Main() {
  const { user } = useUserStore()
  const watermarkConfig = useMemo<WatermarkProps>(() => ({
    content: user?.username,
    gap: [150, 150],
  }), [user?.username])

  return (
    <Watermark
      className="h-[calc(100vh_-_40px)] w-full overflow-y-auto overflow-x-hidden px-3 pt-2"
      content={watermarkConfig.content}
      gap={watermarkConfig.gap}
    >
      <Outlet />
    </Watermark>
  )
}

export { Main }
