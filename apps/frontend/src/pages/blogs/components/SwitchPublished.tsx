import type { Blog } from '~/fetchers'
import { Switch } from 'antd'
import React from 'react'

interface Props {
  record: Blog
}

function SwitchPublished({ record }: Props) {
  return <Switch disabled checkedChildren="Published" unCheckedChildren="Unpublished" checked={record.published} />
}

export { SwitchPublished }
