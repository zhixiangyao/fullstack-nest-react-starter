import type { User } from '~/fetchers'
import { Button } from 'antd'
import React from 'react'

import { useDrawerUserEdit } from '../hooks/useDrawerUserEdit'

interface Props {
  record: User
}

function ButtonEdit({ record }: Props) {
  const drawerUserEdit = useDrawerUserEdit()

  return (
    <Button type="link" className="!px-0" onClick={() => drawerUserEdit.handleOpen(record.username)}>
      编辑
    </Button>
  )
}

export { ButtonEdit }
