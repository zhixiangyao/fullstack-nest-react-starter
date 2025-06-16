import React from 'react'

import { useUserStore } from '~/stores/useUserStore'

function Home() {
  const { user } = useUserStore()

  return (
    <div>
      <span>{`您好 ${user?.username}`}</span>
    </div>
  )
}

export { Home }
