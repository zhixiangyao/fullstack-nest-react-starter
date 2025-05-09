import React from 'react'

interface Props {
  animationDuration: number
  progress: number
}

export const Bar: React.FC<Props> = ({ animationDuration, progress }) => (
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
)
