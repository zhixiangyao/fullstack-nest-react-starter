import type { User } from '~/fetchers'
import { useMemoizedFn, useRequest } from 'ahooks'
import { App as AntdApp, Switch } from 'antd'
import React from 'react'

import * as fetchers from '~/fetchers'

import { CACHE_KEY_USER_FIND_ALL } from '../hooks/useUserList'

interface Props {
  record: User
}

function SwitchStatus({ record }: Props) {
  const { message } = AntdApp.useApp()
  const { loading: loadingUpdate, runAsync } = useRequest(fetchers.userUpdate, {
    manual: true,
  })
  const { loading: loadingFindAll, refreshAsync } = useRequest(fetchers.userFindAll, {
    cacheKey: CACHE_KEY_USER_FIND_ALL,
    manual: true,
  })

  const handleActive = useMemoizedFn(
    async (isActive: boolean) => {
      try {
        const data = await runAsync({ username: record.username, isActive })
        message.success(data.message)
        refreshAsync()
      }
      catch (error) {
        console.log(error)
      }
    },
  )

  return (
    <Switch
      disabled={loadingFindAll || loadingUpdate || record.roles.map(role => role.name).includes('ADMIN')}
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      checked={record.isActive}
      onChange={e => handleActive(e)}
    />
  )
}

export { SwitchStatus }
