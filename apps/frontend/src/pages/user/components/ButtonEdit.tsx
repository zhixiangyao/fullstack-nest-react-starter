import type { TUser } from '~/fetchers/type'
import { useRequest } from 'ahooks'
import { App as AntdApp, Button } from 'antd'
import React, { useCallback } from 'react'

import { deleteUser, getUserList } from '~/fetchers'
import { EnumRole } from '~/fetchers/type'

import { CACHE_KEY_GET_USER_LIST } from '../hooks/useUserList'

interface Props {
  record: TUser
}

export const ButtonEdit: React.FC<Props> = ({ record }) => {
  const { message } = AntdApp.useApp()
  const { loading: loadingUp, runAsync } = useRequest(deleteUser, { manual: true })
  const { refreshAsync, loading: loadingGet } = useRequest(getUserList, {
    cacheKey: CACHE_KEY_GET_USER_LIST,
    manual: true,
  })

  const handleClick = useCallback(async () => {
    const data = await runAsync({ username: record.username })
    message.success(data.message)
    refreshAsync()
  }, [record.username, message, refreshAsync, runAsync])

  return (
    <Button
      disabled={loadingGet || loadingUp || record.roles.includes(EnumRole.ADMIN)}
      type="link"
      onClick={handleClick}
    >
      编辑
    </Button>
  )
}
