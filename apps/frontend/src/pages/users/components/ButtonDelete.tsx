import type { TUser } from '~/fetchers'
import { useRequest } from 'ahooks'
import { App as AntdApp, Button, Popconfirm } from 'antd'
import React, { useCallback } from 'react'

import * as fetchers from '~/fetchers'
import { Role } from '~/fetchers'

import { CACHE_KEY_GET_USER_LIST } from '../hooks/useUserList'

interface Props {
  record: TUser
}

function ButtonDelete({ record }: Props) {
  const { message } = AntdApp.useApp()
  const { loading: loadingDelete, runAsync } = useRequest(fetchers.remove, { manual: true })
  const { refreshAsync, loading: loadingFindAll } = useRequest(fetchers.findAll, {
    cacheKey: CACHE_KEY_GET_USER_LIST,
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
      title="删除用户"
      description={(
        <div>
          您确定要删除
          <b className="text-red-600 mx-1">{record.username}</b>
          用户吗?
        </div>
      )}
      onConfirm={handleConfirm}
      okText="确定"
      cancelText="取消"
    >
      <Button
        danger
        type="link"
        className="!px-0"
        disabled={loadingFindAll || loadingDelete || record.roles.map(role => role.name).includes(Role.ADMIN)}
      >
        删除
      </Button>
    </Popconfirm>
  )
}

export { ButtonDelete }
