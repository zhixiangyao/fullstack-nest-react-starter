import type { PresetColorKey } from 'antd/es/theme/interface'
import type { RoleValue } from '~/fetchers'
import { Tag } from 'antd'
import React, { memo } from 'react'

import { stringCapitalization } from 'utils'
import { Role } from '~/fetchers'

interface Props {
  value?: RoleValue
}

const TagRoleType: React.FC<Props> = memo((props) => {
  const { value } = props

  if (!value)
    return null

  let color: PresetColorKey
  const text = stringCapitalization(value)

  switch (value) {
    case Role.ADMIN:
      color = 'gold'
      break

    case Role.USER:
      color = 'green'
      break
  }

  return (
    <Tag className="select-none" color={color}>
      {text}
    </Tag>
  )
})
TagRoleType.displayName = 'TagRoleType'

export { TagRoleType }
