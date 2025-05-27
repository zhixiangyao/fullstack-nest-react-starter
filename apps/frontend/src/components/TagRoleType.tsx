import type { PresetColorKey } from 'antd/es/theme/interface'
import { Tag } from 'antd'
import React, { memo } from 'react'
import { stringCapitalization } from 'utils'

import { EnumRole } from '~/fetchers'

interface Props {
  value?: EnumRole
}

const TagRoleType: React.FC<Props> = memo((props) => {
  const { value } = props

  if (!value)
    return null

  let color: PresetColorKey
  const text = stringCapitalization(value)

  switch (value) {
    case EnumRole.ADMIN:
      color = 'gold'
      break

    case EnumRole.USER:
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
