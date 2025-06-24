import type { TableColumnProps } from 'antd'
import type { User } from '~/fetchers'
import { useSize } from 'ahooks'
import { Table } from 'antd'
import React, { useRef } from 'react'

import { Filter } from '~/components/Filter'

import { ButtonDelete } from './components/ButtonDelete'
import { ButtonEdit } from './components/ButtonEdit'
import { DrawerEdit } from './components/DrawerEdit'
import { SwitchStatus } from './components/SwitchStatus'
import { useDrawerEdit } from './hooks/useDrawerEdit'
import { useUserList } from './hooks/useUserList'

function Users() {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  const drawerEdit = useDrawerEdit()
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
        dataSource={userList.dataSource}
        pagination={userList.pagination}
        loading={userList.loading}
        scroll={userList.scroll}
      >
        {userList.columns.map((column) => {
          let render: TableColumnProps<User>['render']

          switch (column.key) {
            case 'isActive': {
              render = (_, record) => {
                return <SwitchStatus record={record} />
              }
              break
            }
            case 'actions': {
              render = (_, record) => {
                return (
                  <div className="flex items-center gap-2">
                    <ButtonDelete record={record} />
                    <ButtonEdit record={record} handleOpen={drawerEdit.handleOpen} />
                  </div>
                )
              }
              break
            }
          }

          return (
            <Table.Column<User>
              key={column.key}
              title={column.title}
              dataIndex={column.dataIndex}
              width={column.width}
              ellipsis={column.ellipsis}
              fixed={column.fixed}
              render={render ?? column.render}
            />
          )
        })}
      </Table>

      <DrawerEdit
        user={drawerEdit.user}
        open={drawerEdit.open}
        loading={drawerEdit.loading}
        handleClose={drawerEdit.handleClose}
      />
    </>
  )
}

export { Users }
