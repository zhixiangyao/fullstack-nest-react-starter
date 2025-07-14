import type { User } from '~/fetchers'
import { Button } from 'antd'

interface Props {
  record: User
  handleOpenEdit: (username: User['username']) => Promise<void>
}

function ButtonEdit({ record, handleOpenEdit }: Props) {
  return (
    <Button type="link" className="!px-0" onClick={() => handleOpenEdit(record.username)}>
      Edit
    </Button>
  )
}

export { ButtonEdit }
