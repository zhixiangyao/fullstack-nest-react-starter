import type { User } from '~/fetchers'
import { useSize } from 'ahooks'
import { Table } from 'antd'
import React, { useRef } from 'react'

import { Filter } from '~/components/Filter'

import { DrawerEdit } from './components/DrawerEdit'
import { useDrawerEdit } from './hooks/useDrawerEdit'
import { useUserList } from './hooks/useUserList'
import { useUserListColumns } from './hooks/useUserListColumns'

function Users() {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  const drawerEdit = useDrawerEdit({ refresh })
  const { columns, columnsWidth } = useUserListColumns({
    handleOpen: drawerEdit.handleOpen,
    refresh,
  })
  const userList = useUserList({ filterHeight: size?.height ?? 0, columnsWidth })

  function refresh() {
    userList.refresh()
  }

  return (
    <>
      <Filter
        name="filter-users"
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
        columns={columns}
        dataSource={userList.dataSource}
        pagination={userList.pagination}
        loading={userList.loading}
        scroll={userList.scroll}
      />

      <DrawerEdit
        user={drawerEdit.user}
        form={drawerEdit.form}
        open={drawerEdit.open}
        loading={drawerEdit.loading}
        loadingConfirm={drawerEdit.loadingConfirm}
        handleClose={drawerEdit.handleClose}
        handleFinish={drawerEdit.handleFinish}
      />
    </>
  )
}

export { Users }
