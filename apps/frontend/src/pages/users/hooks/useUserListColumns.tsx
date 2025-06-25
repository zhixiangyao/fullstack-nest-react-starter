import type { ColumnsType } from 'antd/es/table'
import type { User } from '~/fetchers'
import { Tag } from 'antd'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { FormatOptions, formatTime, getColorByDate, timeAgo } from 'utils'

import { TagRoleType } from '~/components/TagRoleType'
import { ButtonDelete } from '../components/ButtonDelete'
import { ButtonEdit } from '../components/ButtonEdit'
import { SwitchStatus } from '../components/SwitchStatus'

type TColumns = (ColumnsType<User>[number] & { dataIndex?: keyof User, key: keyof User | 'actions' })[]

interface Prams {
  handleOpen: (username: User['username']) => Promise<void>
  refresh: () => void
}

export function useUserListColumns({ handleOpen, refresh }: Prams) {
  const columns = useMemo(
    () =>
      [
        {
          title: 'Username',
          dataIndex: 'username',
          key: 'username',
          width: 120,
          ellipsis: true,
          fixed: 'left',
        },
        {
          title: 'Roles',
          dataIndex: 'roles',
          key: 'roles',
          width: 80,
          render(_, record) {
            if (record.roles.length === 0)
              return '/'

            return (
              <div className="flex gap-1 items-center">
                {record.roles.map(role => (
                  <TagRoleType value={role.name} key={role.id} />
                ))}
              </div>
            )
          },
        },
        {
          title: 'Blogs Total',
          dataIndex: 'blogsTotal',
          key: 'blogsTotal',
          width: 120,
        },
        {
          title: 'is Active?',
          dataIndex: 'isActive',
          key: 'isActive',
          width: 100,
          render(_, record) {
            return <SwitchStatus record={record} refresh={refresh} />
          },
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          width: 150,
          render(_, record) {
            return <span>{record.email ?? '/'}</span>
          },
        },
        {
          title: 'Created At',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 300,
          render(_, { createdAt }) {
            return (
              <div className="flex gap-2 items-center">
                <span>{formatTime(createdAt, FormatOptions.YYYY_MM_DD_HH_mm_ss)}</span>
                <Tag className="select-none" color={getColorByDate(dayjs(createdAt).valueOf())}>
                  {timeAgo(dayjs(createdAt).valueOf())}
                </Tag>
              </div>
            )
          },
        },
        {
          title: 'Updated At',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          width: 300,
          render(_, { updatedAt }) {
            return (
              <div className="flex gap-2 items-center">
                <span>{formatTime(updatedAt, FormatOptions.YYYY_MM_DD_HH_mm_ss)}</span>
                <Tag className="select-none" color={getColorByDate(dayjs(updatedAt).valueOf())}>
                  {timeAgo(dayjs(updatedAt).valueOf())}
                </Tag>
              </div>
            )
          },
        },
        {
          title: 'Last Login',
          dataIndex: 'lastLogin',
          key: 'lastLogin',
          width: 300,
          render(_, { lastLogin }) {
            if (!lastLogin)
              return '/'

            return (
              <div className="flex gap-2 items-center">
                <span>{formatTime(lastLogin, FormatOptions.YYYY_MM_DD_HH_mm_ss)}</span>
                <Tag className="select-none" color={getColorByDate(dayjs(lastLogin).valueOf())}>
                  {timeAgo(dayjs(lastLogin).valueOf())}
                </Tag>
              </div>
            )
          },
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 100,
          fixed: 'right',
          render(_, record) {
            return (
              <div className="flex items-center gap-2">
                <ButtonDelete record={record} refresh={refresh} />
                <ButtonEdit record={record} handleOpen={handleOpen} />
              </div>
            )
          },
        },
      ] satisfies TColumns,
    [refresh, handleOpen],
  )
  const columnsWidth = useMemo(
    () => columns.reduce((acc, cur) => acc + (typeof cur.width === 'number' ? cur.width : 200), 0),
    [columns],
  )

  return { columns, columnsWidth }
}
