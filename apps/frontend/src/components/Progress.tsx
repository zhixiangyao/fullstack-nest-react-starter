import { useNProgress } from '@tanem/react-nprogress'
import clsx from 'clsx'

import React from 'react'

export const Progress: React.FC<{ isAnimating: boolean }> = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  })

  return (
    <div
      className={clsx('pointer-events-none', isFinished ? 'opacity-0' : 'opacity-100')}
      style={{ transition: `opacity ${animationDuration}ms linear` }}
    >
      <div
        className="fixed left-0 top-0 z-50 h-0.5 w-full bg-[#29d]"
        style={{
          marginLeft: `${(-1 + progress) * 100}%`,
          transition: `margin-left ${animationDuration}ms linear`,
        }}
      >
        <div
          className="absolute right-0 block h-full w-[100px] -translate-y-1 translate-x-0 rotate-3 opacity-100"
          style={{ boxShadow: '0 0 10px #29d, 0 0 5px #29d' }}
        />
      </div>
    </div>
  )
}
