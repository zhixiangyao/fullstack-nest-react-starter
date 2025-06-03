import type { TUser } from '~/fetchers'
import { useRequest } from 'ahooks'
import { App as AntdApp, Switch } from 'antd'
import React, { useCallback } from 'react'

import * as fetchers from '~/fetchers'
import { Role } from '~/fetchers'

import { CACHE_KEY_GET_USER_LIST } from '../hooks/useUserList'

interface Props {
  record: TUser
}

const SwitchStatus: React.FC<Props> = ({ record }) => {
  const { message } = AntdApp.useApp()
  const { loading: loadingUp, runAsync } = useRequest(fetchers.update, {
    manual: true,
  })
  const { refreshAsync, loading: loadingGet } = useRequest(fetchers.findAll, {
    cacheKey: CACHE_KEY_GET_USER_LIST,
    manual: true,
  })

  const handleActive = useCallback(
    async (enable: boolean) => {
      try {
        const data = await runAsync({ username: record.username, enable })
        message.success(data.message)
        refreshAsync()
      }
      catch (error) {
        console.log(error)
      }
    },
    [message, record.username, refreshAsync, runAsync],
  )

  return (
    <Switch
      disabled={loadingGet || loadingUp || record.roles.includes(Role.ADMIN)}
      checkedChildren="启用"
      unCheckedChildren="禁用"
      checked={record.enable}
      onChange={e => handleActive(e)}
    />
  )
}

export { SwitchStatus }
