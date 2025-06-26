import type { Blog } from '~/fetchers'
import { useMemoizedFn } from 'ahooks'
import { App as AntdApp, Switch } from 'antd'
import React, { useState } from 'react'

import * as fetchers from '~/fetchers'

interface Props {
  record: Blog
  refresh: () => void
}

function SwitchPublished({ record, refresh }: Props) {
  const { message } = AntdApp.useApp()
  const [loading, setLoading] = useState(false)

  const handlePublish = useMemoizedFn(async (published: boolean) => {
    try {
      setLoading(true)
      const data = await fetchers.blogSwitch({ id: record.id, published })
      message.success(data.message)
      refresh()
    }
    finally {
      setLoading(false)
    }
  })

  return (
    <Switch
      disabled={loading}
      checkedChildren="Published"
      unCheckedChildren="Unpublished"
      checked={record.published}
      onChange={e => handlePublish(e)}
    />
  )
}

export { SwitchPublished }
