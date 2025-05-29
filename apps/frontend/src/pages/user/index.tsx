import type { TUser } from '~/fetchers'
import { Table } from 'antd'
import React from 'react'

import { DrawerUserEdit } from './components/DrawerUserEdit'
import { Header } from './components/Header'
import { useUserList } from './hooks/useUserList'

function UserPage() {
  const userList = useUserList()

  return (
    <>
      <Header />

      <Table
        bordered
        size="small"
        rowKey={'uuid' satisfies keyof TUser}
        columns={userList.columns}
        dataSource={userList.dataSource}
        pagination={userList.pagination}
        loading={userList.loading}
        scroll={userList.scroll}
      />

      <DrawerUserEdit />
    </>
  )
}

export { UserPage }
