import type { Breakpoint } from 'antd'
import { Grid } from 'antd'
import { useEffect, useState } from 'react'

const { useBreakpoint } = Grid

export function useCurrentBreakpointList() {
  const screens = useBreakpoint()
  const [currentBreakpointList, setCurrentBreakpointList] = useState<Breakpoint[]>()

  useEffect(() => {
    const list: Breakpoint[] = []
    screens.xxl && list.push('xxl')
    screens.xl && list.push('xl')
    screens.lg && list.push('lg')
    screens.md && list.push('md')
    screens.sm && list.push('sm')
    screens.xs && list.push('xs')
    setCurrentBreakpointList(list)
  }, [screens.lg, screens.md, screens.sm, screens.xl, screens.xs, screens.xxl])

  return currentBreakpointList
}
