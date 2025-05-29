import React from 'react'

import { useUserStore } from '~/stores/useUserStore'

function HomePage() {
  const { user } = useUserStore()

  return (
    <div>
      <span>{`您好 ${user?.username}`}</span>
    </div>
  )
}

export { HomePage }
