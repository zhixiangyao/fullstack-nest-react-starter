import type { User } from '~/fetchers'
import { useSize } from 'ahooks'
import { Table } from 'antd'
import React, { useRef } from 'react'

import { Filter } from '~/components/Filter'

import { DrawerUserEdit } from './components/DrawerUserEdit'
import { useUserList } from './hooks/useUserList'

function Users() {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  const userList = useUserList({ filterHeight: size?.height ?? 0 })

  return (
    <>
      <Filter
        customRef={ref}
        loading={userList.loading}
        form={userList.form}
        fields={userList.fields}
        handleFinish={userList.handleFinish}
        handleReset={userList.handleReset}
      />

      <Table<User>
        size="small"
        rowKey={'uuid' satisfies keyof User}
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

export { Users }
