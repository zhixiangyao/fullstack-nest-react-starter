import type { User } from '~/fetchers'
import { useSize } from 'ahooks'
import { Table } from 'antd'
import { useRef } from 'react'

import { Filter } from '~/components/Filter'

import { ButtonDelete } from './components/ButtonDelete'
import { ButtonEdit } from './components/ButtonEdit'
import { DrawerEdit } from './components/DrawerEdit'
import { useDrawerEdit } from './hooks/useDrawerEdit'
import { useUserList } from './hooks/useUserList'

function Users() {
  const refFilter = useRef<HTMLDivElement>(null)
  const size = useSize(refFilter)
  const drawerEdit = useDrawerEdit()
  const userList = useUserList({ filterHeight: size?.height ?? 0 })

  return (
    <>
      <Filter
        name="filter-users"
        customRef={refFilter}
        loading={userList.loading}
        form={userList.form}
        fields={userList.fields}
        handleFinish={userList.handleFinish}
        handleReset={userList.handleReset}
      />

      <Table<User>
        size="small"
        rowKey={'uuid' satisfies keyof User}
        dataSource={userList.dataSource}
        pagination={userList.pagination}
        loading={userList.loading}
        scroll={userList.scroll}
      >
        {userList.columns.map(column => (
          <Table.Column<User>
            title={column.title}
            dataIndex={column.dataIndex}
            key={column.key}
            width={column.width}
            fixed={column.fixed}
            ellipsis={column.ellipsis}
            render={column.render}
          />
        ))}

        <Table.Column<User>
          title="Actions"
          key="actions"
          width={140}
          fixed="right"
          render={(_, record) => (
            <div className="flex items-center gap-2">
              <ButtonDelete record={record} refresh={userList.refresh} />
              <ButtonEdit record={record} handleOpenEdit={drawerEdit.handleOpenEdit} />
            </div>
          )}
        />
      </Table>

      <DrawerEdit
        user={drawerEdit.user}
        form={drawerEdit.form}
        open={drawerEdit.open}
        loading={drawerEdit.loading}
        loadingConfirm={drawerEdit.loadingConfirm}
        handleClose={drawerEdit.handleClose}
        handleFinish={drawerEdit.handleFinish}
        refresh={userList.refresh}
      />
    </>
  )
}

export { Users }
