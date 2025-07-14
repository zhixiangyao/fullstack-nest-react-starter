import type { WatermarkProps } from 'antd'
import { Watermark } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { Progress } from '~/components/Progress'
import { useUserStore } from '~/stores/useUserStore'

function Container({ children }: { children?: React.ReactNode }) {
  const location = useLocation()
  const userStore = useUserStore()
  const watermarkConfig = useMemo<WatermarkProps>(
    () => ({
      content: userStore.user?.username,
      gap: [150, 150],
    }),
    [userStore.user?.username],
  )
  const [pathname, setPathname] = useState('/')
  const isAnimating = location.pathname !== pathname

  useEffect(() => {
    setPathname(location.pathname)
  }, [location.pathname])

  return (
    <Watermark content={watermarkConfig.content} gap={watermarkConfig.gap}>
      <Progress isAnimating={isAnimating} />

      {children}
    </Watermark>
  )
}

export { Container }
