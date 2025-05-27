import { Drawer } from 'antd'
import React, { memo } from 'react'

import { useDrawerUserEdit } from '../hooks/useDrawerUserEdit'

export const DrawerUserEdit = memo(() => {
  const drawerUserEdit = useDrawerUserEdit()

  return (
    <Drawer
      width={700}
      title="编辑用户"
      placement="right"
      onClose={drawerUserEdit.handleClose}
      open={drawerUserEdit.open}
    >
      {drawerUserEdit.uuid}
    </Drawer>
  )
})
DrawerUserEdit.displayName = 'DrawerUserEdit'
