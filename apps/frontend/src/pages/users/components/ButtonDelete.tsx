import type { User } from '~/fetchers'
import { useRequest } from 'ahooks'
import { App as AntdApp, Button, Popconfirm } from 'antd'
import React, { useCallback } from 'react'

import * as fetchers from '~/fetchers'

import { CACHE_KEY_USER_FIND_ALL } from '../hooks/useUserList'

interface Props {
  record: User
}

function ButtonDelete({ record }: Props) {
  const { message } = AntdApp.useApp()
  const { loading: loadingDelete, runAsync } = useRequest(fetchers.userRemove, { manual: true })
  const { refreshAsync, loading: loadingFindAll } = useRequest(fetchers.userFindAll, {
    cacheKey: CACHE_KEY_USER_FIND_ALL,
    manual: true,
  })

  const handleConfirm = useCallback(async () => {
    try {
      const data = await runAsync({ username: record.username })
      message.success(data.message)
      refreshAsync()
    }
    catch (error) {
      console.log(error)
    }
  }, [record.username, message, refreshAsync, runAsync])

  return (
    <Popconfirm
      title="Delete user"
      description={(
        <div>
          Are you sure you want to delete
          <b className="text-red-600 mx-1">{record.username}</b>
          user?
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
        disabled={loadingFindAll || loadingDelete || record.roles.map(role => role.name).includes('ADMIN')}
      >
        Delete
      </Button>
    </Popconfirm>
  )
}

export { ButtonDelete }
