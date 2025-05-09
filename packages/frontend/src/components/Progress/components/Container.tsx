import clsx from 'clsx'
import React from 'react'

interface Props {
  animationDuration: number
  isFinished: boolean
  children: React.ReactNode
}

export const Container: React.FC<Props> = ({ animationDuration, children, isFinished }) => (
  <div
    className={clsx('pointer-events-none', isFinished ? 'opacity-0' : 'opacity-100')}
    style={{ transition: `opacity ${animationDuration}ms linear` }}
  >
    {children}
  </div>
)
