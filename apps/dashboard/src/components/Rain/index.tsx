import { useEventListener, useExternal, useMemoizedFn } from 'ahooks'
import { useEffect, useRef } from 'react'

const path = 'https://yaozhixiang.top/assets/js/RaindropFX.js'

interface Props {
  background: string
}

function Rain({ background }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentBackground = useRef<string>()
  const raindropFxRef = useRef<InstanceType<typeof window.RaindropFX>>()
  const status = useExternal(path, { js: { async: true } })

  const handleResizeRain = useMemoizedFn(() => {
    const canvas = canvasRef.current
    const rect = canvas?.getBoundingClientRect()

    if (raindropFxRef.current && rect) {
      raindropFxRef.current.resize(rect.width, rect.height)
    }
  })

  const handleReset = useMemoizedFn(() => {
    try {
      raindropFxRef.current?.setBackground('')
      raindropFxRef.current?.stop()
      raindropFxRef.current = void 0
      currentBackground.current = void 0
    }
    catch {}
  })

  const handleUpdateBackground = useMemoizedFn(() => {
    if (background !== currentBackground.current) {
      raindropFxRef.current?.setBackground(background)
      currentBackground.current = background
    }
  })

  const initRain = useMemoizedFn(() => {
    if (!canvasRef.current)
      return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width
    canvas.height = rect.height

    if (!status || !window.RaindropFX)
      return

    raindropFxRef.current = new window.RaindropFX({ canvas, background })
    raindropFxRef.current.start()
    currentBackground.current = background
    return () => handleReset()
  })

  useEventListener('resize', handleResizeRain)
  useEffect(initRain, [initRain, status])
  useEffect(handleUpdateBackground, [handleUpdateBackground, background])

  return <canvas ref={canvasRef} className="fixed inset-0 w-screen h-screen translate-x-0" />
}

export { Rain }
