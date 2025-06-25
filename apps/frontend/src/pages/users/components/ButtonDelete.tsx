import type { User } from '~/fetchers'
import { useMemoizedFn } from 'ahooks'
import { App as AntdApp, Button, Popconfirm } from 'antd'
import React, { useState } from 'react'

import * as fetchers from '~/fetchers'

interface Props {
  record: User
  refresh: () => void
}

function ButtonDelete({ record, refresh }: Props) {
  const { message } = AntdApp.useApp()
  const [loading, setLoading] = useState(false)

  const handleConfirm = useMemoizedFn(async () => {
    try {
      setLoading(true)
      const data = await fetchers.userRemove({ username: record.username })
      message.success(data.message)
      refresh()
    }
    finally {
      setLoading(false)
    }
  })

  return (
    <Popconfirm
      title="Delete user"
      description={(
        <div>
          Are you sure you want to delete
          <b className="text-red-600 mx-1">{record.username}</b>
          user?
        </div>
      )}
      onConfirm={handleConfirm}
      okText="Confirm"
      cancelText="Cancel"
    >
      <Button
        danger
        type="link"
        className="!px-0"
        disabled={loading || record.roles.map(role => role.name).includes('ADMIN')}
      >
        Delete
      </Button>
    </Popconfirm>
  )
}

export { ButtonDelete }
