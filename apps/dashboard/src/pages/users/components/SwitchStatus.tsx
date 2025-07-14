import type { User } from '~/fetchers'
import { useMemoizedFn } from 'ahooks'
import { App as AntdApp, Switch } from 'antd'
import { useState } from 'react'

import * as fetchers from '~/fetchers'

interface Props {
  record: User
  refresh: () => void
}

function SwitchStatus({ record, refresh }: Props) {
  const { message } = AntdApp.useApp()
  const [loading, setLoading] = useState(false)

  const handleActive = useMemoizedFn(
    async (isActive: boolean) => {
      try {
        setLoading(true)
        const data = await fetchers.userSwitch({ username: record.username, isActive })
        message.success(data.message)
        refresh()
      }
      finally {
        setLoading(false)
      }
    },
  )

  return (
    <Switch
      disabled={loading || record.roles.map(role => role.name).includes('ADMIN')}
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      checked={record.isActive}
      onChange={e => handleActive(e)}
    />
  )
}

export { SwitchStatus }
