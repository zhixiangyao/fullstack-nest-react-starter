import type { User } from '~/fetchers'
import { Button } from 'antd'
import React from 'react'

interface Props {
  record: User
  handleOpen: (username: User['username']) => Promise<void>
}

function ButtonEdit({ record, handleOpen }: Props) {
  return (
    <Button type="link" className="!px-0" onClick={() => handleOpen(record.username)}>
      Edit
    </Button>
  )
}

export { ButtonEdit }
