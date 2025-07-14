import type { Blog } from '~/fetchers'
import { useMemoizedFn } from 'ahooks'
import { App as AntdApp, Button, Popconfirm } from 'antd'
import { useState } from 'react'

import * as fetchers from '~/fetchers'

interface Props {
  record: Blog
  refresh: () => void
}

function ButtonDelete({ record, refresh }: Props) {
  const { message } = AntdApp.useApp()
  const [loading, setLoading] = useState(false)

  const handleConfirm = useMemoizedFn(async () => {
    try {
      setLoading(true)
      const data = await fetchers.blogRemove({ id: record.id })
      message.success(data.message)
      refresh()
    }
    finally {
      setLoading(false)
    }
  })

  return (
    <Popconfirm
      title="Delete blog"
      description={(
        <div>
          Are you sure you want to delete
          <b className="text-red-600 mx-1">{record.title}</b>
          blog?
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
        disabled={loading}
      >
        Delete
      </Button>
    </Popconfirm>
  )
}

export { ButtonDelete }
