import type { Blog } from '~/fetchers'
import { Button } from 'antd'
import React from 'react'

interface Props {
  record: Blog
  handleOpenEdit: (id: Blog['id']) => Promise<void>
}

function ButtonEdit({ record, handleOpenEdit }: Props) {
  return (
    <Button type="link" className="!px-0" onClick={() => handleOpenEdit(record.id)}>
      Edit
    </Button>
  )
}

export { ButtonEdit }
