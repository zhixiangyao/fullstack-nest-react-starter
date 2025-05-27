import type { TablePaginationConfig } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TUser } from '~/fetchers'
import { useRequest, useSize } from 'ahooks'
import React, { useMemo } from 'react'
import { FormatOptions, formatTime } from 'utils'

import { TagRoleType } from '~/components/TagRoleType'
import * as fetchers from '~/fetchers'

import { ButtonDelete } from '../components/ButtonDelete'
import { ButtonEdit } from '../components/ButtonEdit'
import { SwitchStatus } from '../components/SwitchStatus'

const columns: ColumnsType<TUser> = [
  {
    title: '用户名',
    dataIndex: 'username' satisfies keyof TUser,
    key: 'username',
    width: 150,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '角色',
    dataIndex: 'roles' satisfies keyof TUser,
    key: 'roles',
    width: 100,
    render(_, record) {
      return (
        <div className="flex gap-1 items-center">
          {record.roles.map(role => (
            <TagRoleType value={role} key={role} />
          ))}
        </div>
      )
    },
  },
  {
    title: '状态',
    dataIndex: 'status' satisfies keyof TUser,
    key: 'status',
    width: 100,
    render(_, record) {
      return <SwitchStatus record={record} />
    },
  },
  {
    title: '邮箱',
    dataIndex: 'email' satisfies keyof TUser,
    key: 'email',
    width: 150,
    render(_, record) {
      return <span>{record.email ?? '/'}</span>
    },
  },
  {
    title: '创建于',
    dataIndex: 'createdAt' satisfies keyof TUser,
    key: 'createdAt',
    width: 200,
    render(_, { createdAt }) {
      return <span>{createdAt ? formatTime(createdAt, FormatOptions.YYYY_MM_DD_HH_mm_ss) : '/'}</span>
    },
  },
  {
    title: '更新于',
    dataIndex: 'updatedAt' satisfies keyof TUser,
    key: 'updatedAt',
    width: 200,
    render(_, { updatedAt }) {
      return <span>{updatedAt ? formatTime(updatedAt, FormatOptions.YYYY_MM_DD_HH_mm_ss) : '/'}</span>
    },
  },
  {
    title: '上一次登录',
    dataIndex: 'lastLogin' satisfies keyof TUser,
    key: 'lastLogin',
    width: 200,
    render(_, { lastLogin }) {
      return <span>{lastLogin ? formatTime(lastLogin, FormatOptions.YYYY_MM_DD_HH_mm_ss) : '/'}</span>
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    fixed: 'right',
    render(_, record) {
      return (
        <div className="flex items-center gap-2">
          <ButtonDelete record={record} />
          <ButtonEdit record={record} />
        </div>
      )
    },
  },
]

export const CACHE_KEY_GET_USER_LIST = 'cacheKey-share-findAll'

export function useUserList() {
  const { data, loading, runAsync } = useRequest(fetchers.findAll, {
    cacheKey: CACHE_KEY_GET_USER_LIST,
    defaultParams: [
      {
        pageNo: 1,
        pageSize: 20,
      },
    ],
  })
  const dataSource = useMemo(() => data?.data.list ?? [], [data?.data.list])
  const pagination = useMemo<TablePaginationConfig>(
    () => ({
      current: data?.data.pageNo,
      total: data?.data.total,
      pageSize: data?.data.pageSize,
      onChange(page, pageSize) {
        runAsync({ pageNo: page, pageSize })
      },
    }),
    [data?.data, runAsync],
  )
  const size = useSize(document.querySelector('html'))
  const scroll = useMemo(() => {
    const x = columns.reduce((acc, cur) => acc + (typeof cur.width === 'number' ? cur.width : 200), 0)
    const y = (size?.height ?? 0) - 50 - 8 - 30 - 39 - 56

    return { x, y }
  }, [size?.height])

  return {
    loading,
    pagination,
    dataSource,
    scroll,
    columns,
  }
}
