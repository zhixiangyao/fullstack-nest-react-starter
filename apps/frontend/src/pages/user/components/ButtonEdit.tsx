import type { TUser } from '~/fetchers'
import { Button } from 'antd'
import React from 'react'

import { EnumRole } from '~/fetchers'

import { useDrawerUserEdit } from '../hooks/useDrawerUserEdit'

interface Props {
  record: TUser
}

export const ButtonEdit: React.FC<Props> = ({ record }) => {
  const drawerUserEdit = useDrawerUserEdit()

  return (
    <Button
      type="link"
      className="!px-0"
      disabled={record.roles.includes(EnumRole.ADMIN)}
      onClick={() => drawerUserEdit.handleOpen(record.uuid)}
    >
      编辑
    </Button>
  )
}
