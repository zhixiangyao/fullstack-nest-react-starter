import React from 'react'

import { useUserStore } from '~/stores/useUserStore'

function Home() {
  const { user } = useUserStore()

  return (
    <div>
      <span>Hello</span>
      &nbsp;
      <b>{user?.username}</b>
    </div>
  )
}

export { Home }
