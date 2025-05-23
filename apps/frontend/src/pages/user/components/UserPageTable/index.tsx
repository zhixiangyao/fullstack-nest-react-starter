import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { TUser } from '~/fetchers/type'
import { Table } from 'antd'
import React, { memo, useMemo } from 'react'
import { formatTime } from 'utils'

import { TagRoleType } from '~/components/TagRoleType'
import { ActionActive } from './components/ActionActive'

const columns: ColumnsType<TUser> = [
  {
    title: 'ID',
    dataIndex: 'userId' satisfies keyof TUser,
    key: 'userId',
    width: 100,
  },
  {
    title: '用户名',
    dataIndex: 'username' satisfies keyof TUser,
    key: 'username',
    width: 200,
    ellipsis: true,
  },
  {
    title: '角色',
    dataIndex: 'role' satisfies keyof TUser,
    key: 'role',
    width: 100,
    render: (_, { role }) => <TagRoleType value={role} />,
  },
  {
    title: '状态',
    dataIndex: 'status' satisfies keyof TUser,
    key: 'status',
    width: 100,
    render: (_, record) => <ActionActive record={record} />,
  },
  {
    title: '创建于',
    dataIndex: 'createdAt' satisfies keyof TUser,
    key: 'createdAt',
    width: 200,
    render: (_, { createdAt }) => <span>{formatTime(createdAt)}</span>,
  },
  {
    title: '上一次登录',
    dataIndex: 'lastLogin' satisfies keyof TUser,
    key: 'lastLogin',
    width: 200,
    render: (_, { lastLogin }) => <span>{formatTime(lastLogin)}</span>,
  },
]

interface Props {
  dataSource: TUser[]
  pagination?: TablePaginationConfig
  loading?: boolean
}

export const UserPageTable = memo<Props>(({ dataSource, pagination, loading }) => {
  const x = useMemo(() => columns.reduce((acc, cur) => acc + (typeof cur.width === 'number' ? cur.width : 200), 0), [])
  return (
    <Table
      bordered
      size="small"
      rowKey={'userId' satisfies keyof TUser}
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      loading={loading}
      scroll={{ x }}
    />
  )
})
UserPageTable.displayName = 'UserPageTable'
