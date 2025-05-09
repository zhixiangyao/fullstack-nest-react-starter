import type { GetProps } from 'antd'
import { useRequest } from 'ahooks'
import React, { useMemo } from 'react'

import { getUserList } from '~/fetchers'
import { UserPageHeader } from './components/UserPageHeader'

import { UserPageTable } from './components/UserPageTable'

export function UserPage() {
  const { data, loading, runAsync } = useRequest(getUserList, {
    cacheKey: 'cacheKey-share-getUserList',
  })
  const tableProps = useMemo<GetProps<typeof UserPageTable>>(
    () => ({
      loading,
      dataSource: data?.data.list ?? [],
      pagination: {
        current: data?.data.pageNo,
        total: data?.data.total,
        pageSize: data?.data.pageSize,
        onChange(page, pageSize) {
          console.log(page, pageSize)
          runAsync({ pageNo: page, pageSize })
        },
      },
    }),
    [data?.data, loading, runAsync],
  )

  return (
    <>
      <UserPageHeader />

      <UserPageTable {...tableProps} />
    </>
  )
}
