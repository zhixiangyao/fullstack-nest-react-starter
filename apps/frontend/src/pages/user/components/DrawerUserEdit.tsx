import { Drawer } from 'antd'
import React, { memo, useCallback } from 'react'

interface Props {
  open: boolean
  setOpen: React.Dispatch<boolean>
}

export const DrawerUserEdit = memo<Props>(({ open, setOpen }) => {
  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Drawer width={700} title="编辑用户" placement="right" onClose={handleClose} open={open}>
      TODO
    </Drawer>
  )
})
DrawerUserEdit.displayName = 'DrawerUserEdit'
