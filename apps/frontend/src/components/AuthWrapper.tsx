import type React from 'react'
import { memo } from 'react'

import { Role } from '~/fetchers/type'
import { useUserStore } from '~/stores/useUserStore'

interface Props {
  component: React.JSX.Element
  roles?: Role[]
}

const AuthWrapper = memo<Props>((props) => {
  const { component, roles } = props
  const { user } = useUserStore()

  if (!user)
    return null

  if (roles && !roles.includes(user.role))
    return null
  else if (!roles && user.role !== Role.ADMIN)
    return null

  return component
})
AuthWrapper.displayName = 'AuthWrapper'

export { AuthWrapper }
