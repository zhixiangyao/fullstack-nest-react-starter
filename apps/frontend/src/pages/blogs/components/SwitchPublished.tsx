import type { Blog } from '~/fetchers'
import { Switch } from 'antd'
import React from 'react'

interface Props {
  record: Blog
}

function SwitchPublished({ record }: Props) {
  return <Switch disabled checkedChildren="已发布" unCheckedChildren="未发布" checked={record.published} />
}

export { SwitchPublished }
