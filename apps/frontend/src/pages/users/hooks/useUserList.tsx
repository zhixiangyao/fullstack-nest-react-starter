import type { TablePaginationConfig } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TField } from '~/components/Filter'
import type { User, UserFindAllRequest } from '~/fetchers'
import { useRequest } from 'ahooks'
import { Form, Tag } from 'antd'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { FormatOptions, formatTime, getColorByDate, timeAgo } from 'utils'

import { TagRoleType } from '~/components/TagRoleType'
import * as fetchers from '~/fetchers'
import { useAppStore } from '~/stores/useAppStore'

import { ButtonDelete } from '../components/ButtonDelete'
import { ButtonEdit } from '../components/ButtonEdit'
import { SwitchStatus } from '../components/SwitchStatus'

type TFieldFilter = UserFindAllRequest

const columns: ColumnsType<User> = [
  {
    title: 'Username',
    dataIndex: 'username' satisfies keyof User,
    key: 'username',
    width: 120,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: 'Roles',
    dataIndex: 'roles' satisfies keyof User,
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
    dataIndex: 'blogsTotal' satisfies keyof User,
    key: 'blogsTotal',
    width: 120,
  },
  {
    title: 'is Active?',
    dataIndex: 'isActive' satisfies keyof User,
    key: 'isActive',
    width: 100,
    render(_, record) {
      return <SwitchStatus record={record} />
    },
  },
  {
    title: 'Email',
    dataIndex: 'email' satisfies keyof User,
    key: 'email',
    width: 150,
    render(_, record) {
      return <span>{record.email ?? '/'}</span>
    },
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt' satisfies keyof User,
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
    dataIndex: 'updatedAt' satisfies keyof User,
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
    dataIndex: 'lastLogin' satisfies keyof User,
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
          <ButtonDelete record={record} />
          <ButtonEdit record={record} />
        </div>
      )
    },
  },
]

const fields: TField<UserFindAllRequest>[] = [{ type: 'input', name: 'username', label: 'Username' }]

export const CACHE_KEY_USER_FIND_ALL = 'cacheKey-user-find-all'

export function useUserList({ filterHeight }: { filterHeight: number }) {
  const { data, loading, runAsync } = useRequest(fetchers.userFindAll, {
    cacheKey: CACHE_KEY_USER_FIND_ALL,
  })
  const { size } = useAppStore()
  const [form] = Form.useForm<TFieldFilter>()
  const dataSource = useMemo(() => data?.data.list ?? [], [data?.data.list])
  const pagination = useMemo<TablePaginationConfig>(
    () => ({
      showTotal: total => `A total of ${total} items`,
      current: data?.data.pageNo,
      total: data?.data.total,
      pageSize: data?.data.pageSize,
      onChange(pageNo, pageSize) {
        const reset = form.getFieldsValue()
        runAsync({ pageNo, pageSize, ...reset })
      },
    }),
    [data?.data.pageNo, data?.data.pageSize, data?.data.total, form, runAsync],
  )
  const scroll = useMemo(() => {
    const x = columns.reduce((acc, cur) => acc + (typeof cur.width === 'number' ? cur.width : 200), 0)
    const y = (size?.height ?? 0) - 40 - 8 - filterHeight - 39 - 56

    return { x, y }
  }, [size?.height, filterHeight])

  const handleFinish = (values: TFieldFilter) => {
    runAsync(values)
  }

  const handleReset = () => {
    form.resetFields()
    runAsync({})
  }

  return {
    fields,
    form,
    loading,
    pagination,
    dataSource,
    scroll,
    columns,

    handleFinish,
    handleReset,
  }
}
