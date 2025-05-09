import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { TUser } from '~/fetchers/type'
import { Space, Table } from 'antd'

import React, { memo } from 'react'

import { TagRoleType } from '~/components/TagRoleType'
import { Role } from '~/fetchers/type'
import { formatTime } from '~/utils/time'
import { ActionActive } from './components/ActionActive'

const columns: ColumnsType<TUser> = [
  {
    title: 'ID',
    key: 'id',
    width: '15%',
    ellipsis: true,
    render: (_, { userId }) => <span>{userId}</span>,
  },
  {
    title: '用户名',
    key: 'username',
    width: '20%',
    ellipsis: true,
    render: (_, { username }) => <span>{username}</span>,
  },
  {
    title: '角色',
    key: 'role',
    width: '20%',
    ellipsis: true,
    render: (_, { role }) => <TagRoleType value={role} />,
  },
  {
    title: '创建于',
    key: 'createdAt',
    width: '20%',
    ellipsis: true,
    render: (_, { createdAt }) => <span>{formatTime(createdAt)}</span>,
  },
  {
    title: '上一次登录',
    key: 'createdAt',
    width: '20%',
    ellipsis: true,
    render: (_, { lastLogin }) => <span>{formatTime(lastLogin)}</span>,
  },
  {
    title: '操作',
    key: 'action',
    width: '20%',
    render: (_, record) => (
      <Space size="middle">{record.role === Role.ADMIN ? null : <ActionActive record={record} />}</Space>
    ),
  },
]

interface Props {
  dataSource: TUser[]
  pagination?: TablePaginationConfig
  loading?: boolean
}

export const UserPageTable = memo<Props>(({ dataSource, pagination, loading }) => {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="userId"
      bordered
      size="small"
      pagination={pagination}
      loading={loading}
    />
  )
})
UserPageTable.displayName = 'UserPageTable'
