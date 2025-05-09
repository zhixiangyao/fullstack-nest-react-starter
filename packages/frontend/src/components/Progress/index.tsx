import { useNProgress } from '@tanem/react-nprogress'
import React from 'react'

import { Bar } from './components/Bar'
import { Container } from './components/Container'

export const Progress: React.FC<{ isAnimating: boolean }> = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  })

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
    </Container>
  )
}
