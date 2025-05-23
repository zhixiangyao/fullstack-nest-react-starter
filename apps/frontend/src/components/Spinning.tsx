import type { SpinProps } from 'antd'
import { Spin } from 'antd'
import React from 'react'

interface SpinningProps extends SpinProps {}

function Spinning(props: SpinningProps) {
  return <Spin className="absolute left-2/4 top-2/4 translate-x-[-50%,-50%]" spinning {...props} />
}

export { Spinning }
