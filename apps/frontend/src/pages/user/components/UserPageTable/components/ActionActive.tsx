import type { TUser } from '~/fetchers/type'
import { useRequest } from 'ahooks'
import { message, Switch } from 'antd'

import React, { useCallback } from 'react'
import { AuthWrapper } from '~/components/AuthWrapper'
import { getUserList, updateUser } from '~/fetchers'
import { Role, Status } from '~/fetchers/type'

interface Props {
  record: TUser
}

export const ActionActive: React.FC<Props> = ({ record }) => {
  const { loading: loadingUp, runAsync } = useRequest(updateUser, {
    manual: true,
  })
  const { refreshAsync, loading: loadingGet } = useRequest(getUserList, {
    cacheKey: 'cacheKey-share-getUserList',
    manual: true,
  })

  const handleActive = useCallback(
    async (e: boolean) => {
      try {
        const data = await runAsync({ username: record.username, status: e ? Status.Active : Status.Inactive })
        message.success(data.message)
        refreshAsync()
      }
      catch (error) {
        console.log(error)
      }
    },
    [record.username, refreshAsync, runAsync],
  )

  return (
    <AuthWrapper
      component={(
        <Switch
          disabled={loadingGet || loadingUp || record.role === Role.ADMIN}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          checked={record.status === Status.Active}
          onChange={e => handleActive(e)}
        />
      )}
    />
  )
}
