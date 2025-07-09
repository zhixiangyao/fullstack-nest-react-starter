import type { PresetColorKey } from 'antd/es/theme/interface'
import { Tag } from 'antd'
import { stringCapitalization } from 'utils'

interface Props {
  value?: string
}

function TagRoleType(props: Props) {
  const { value } = props

  if (!value)
    return null

  let color: PresetColorKey
  const text = stringCapitalization(value)

  switch (value) {
    case 'ADMIN':
      color = 'gold'
      break

    default:
      color = 'green'
      break
  }

  return (
    <Tag className="select-none" color={color}>
      {text}
    </Tag>
  )
}

export { TagRoleType }
