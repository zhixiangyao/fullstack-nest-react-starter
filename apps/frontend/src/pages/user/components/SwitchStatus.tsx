import type { TUser } from '~/fetchers/type'
import { useRequest } from 'ahooks'
import { App as AntdApp, Switch } from 'antd'
import React, { useCallback } from 'react'

import { getUserList, updateUser } from '~/fetchers'
import { EnumRole, EnumStatus } from '~/fetchers/type'

import { CACHE_KEY_GET_USER_LIST } from '../hooks/useUserList'

interface Props {
  record: TUser
}

export const SwitchStatus: React.FC<Props> = ({ record }) => {
  const { message } = AntdApp.useApp()
  const { loading: loadingUp, runAsync } = useRequest(updateUser, {
    manual: true,
  })
  const { refreshAsync, loading: loadingGet } = useRequest(getUserList, {
    cacheKey: CACHE_KEY_GET_USER_LIST,
    manual: true,
  })

  const handleActive = useCallback(
    async (e: boolean) => {
      try {
        const data = await runAsync({ username: record.username, status: e ? EnumStatus.Active : EnumStatus.Inactive })
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
      disabled={loadingGet || loadingUp || record.roles.includes(EnumRole.ADMIN)}
      checkedChildren="启用"
      unCheckedChildren="禁用"
      checked={record.status === EnumStatus.Active}
      onChange={e => handleActive(e)}
    />
  )
}
