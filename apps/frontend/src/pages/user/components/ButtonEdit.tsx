import type { TUser } from '~/fetchers'
import { Button } from 'antd'
import React from 'react'

import { useDrawerUserEdit } from '../hooks/useDrawerUserEdit'

interface Props {
  record: TUser
}

export const ButtonEdit: React.FC<Props> = ({ record }) => {
  const drawerUserEdit = useDrawerUserEdit()

  return (
    <Button type="link" className="!px-0" onClick={() => drawerUserEdit.handleOpen(record.username)}>
      编辑
    </Button>
  )
}
