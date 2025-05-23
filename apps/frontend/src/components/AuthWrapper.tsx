import { Tooltip } from 'antd'
import React, { memo } from 'react'

import { Role } from '~/fetchers/type'
import { useUserStore } from '~/stores/useUserStore'

interface Props {
  component: React.JSX.Element
}

const AuthWrapper = memo<Props>((props) => {
  const { component } = props
  const { user } = useUserStore()

  if (!user)
    return component

  return user.role === Role.ADMIN
    ? (
        component
      )
    : (
        <Tooltip title="你没有权限">{React.cloneElement(component, { onClick: undefined, disabled: true })}</Tooltip>
      )
})
AuthWrapper.displayName = 'AuthWrapper'

export { AuthWrapper }
