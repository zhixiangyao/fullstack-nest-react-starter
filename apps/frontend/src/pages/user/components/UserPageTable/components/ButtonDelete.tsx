import type { TUser } from '~/fetchers/type'
import { useRequest } from 'ahooks'
import { App as AntdApp, Button, Popconfirm } from 'antd'

import React, { useCallback } from 'react'
import { AuthWrapper } from '~/components/AuthWrapper'
import { deleteUser, getUserList } from '~/fetchers'
import { Role } from '~/fetchers/type'

interface Props {
  record: TUser
}

export const ButtonDelete: React.FC<Props> = ({ record }) => {
  const { message } = AntdApp.useApp()
  const { loading: loadingUp, runAsync } = useRequest(deleteUser, { manual: true })
  const { refreshAsync, loading: loadingGet } = useRequest(getUserList, {
    cacheKey: 'cacheKey-share-getUserList',
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
    <AuthWrapper
      component={(
        <Popconfirm
          title="删除用户"
          description="您确定要删除此用户吗?"
          onConfirm={handleConfirm}
          okText="确定"
          cancelText="取消"
        >
          <Button danger disabled={loadingGet || loadingUp || record.role === Role.ADMIN} type="text">
            删除
          </Button>
        </Popconfirm>
      )}
    />
  )
}
