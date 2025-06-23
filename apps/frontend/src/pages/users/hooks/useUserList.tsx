import type { TablePaginationConfig } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TField } from '~/components/Filter'
import type { User, UserFindAllRequest } from '~/fetchers'
import { useRequest, useSize } from 'ahooks'
import { Form, Tag } from 'antd'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { FormatOptions, formatTime, getColorByDate, timeAgo } from 'utils'

import { TagRoleType } from '~/components/TagRoleType'
import * as fetchers from '~/fetchers'

import { ButtonDelete } from '../components/ButtonDelete'
import { ButtonEdit } from '../components/ButtonEdit'
import { SwitchStatus } from '../components/SwitchStatus'

type TFieldFilter = UserFindAllRequest

const columns: ColumnsType<User> = [
  {
    title: '用户名',
    dataIndex: 'username' satisfies keyof User,
    key: 'username',
    width: 150,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '角色',
    dataIndex: 'roles' satisfies keyof User,
    key: 'roles',
    width: 100,
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
    title: '状态',
    dataIndex: 'enable' satisfies keyof User,
    key: 'enable',
    width: 100,
    render(_, record) {
      return <SwitchStatus record={record} />
    },
  },
  {
    title: '邮箱',
    dataIndex: 'email' satisfies keyof User,
    key: 'email',
    width: 150,
    render(_, record) {
      return <span>{record.email ?? '/'}</span>
    },
  },
  {
    title: '创建于',
    dataIndex: 'createdAt' satisfies keyof User,
    key: 'createdAt',
    width: 200,
    render(_, { createdAt }) {
      return (
        <div className="flex flex-col gap-1 items-start">
          <span>{formatTime(createdAt, FormatOptions.YYYY_MM_DD_HH_mm_ss)}</span>
          <Tag className="select-none" color={getColorByDate(dayjs(createdAt).valueOf())}>
            {timeAgo(dayjs(createdAt).valueOf())}
          </Tag>
        </div>
      )
    },
  },
  {
    title: '更新于',
    dataIndex: 'updatedAt' satisfies keyof User,
    key: 'updatedAt',
    width: 200,
    render(_, { updatedAt }) {
      return (
        <div className="flex flex-col gap-1 items-start">
          <span>{formatTime(updatedAt, FormatOptions.YYYY_MM_DD_HH_mm_ss)}</span>
          <Tag className="select-none" color={getColorByDate(dayjs(updatedAt).valueOf())}>
            {timeAgo(dayjs(updatedAt).valueOf())}
          </Tag>
        </div>
      )
    },
  },
  {
    title: '上一次登录',
    dataIndex: 'lastLogin' satisfies keyof User,
    key: 'lastLogin',
    width: 200,
    render(_, { lastLogin }) {
      if (!lastLogin)
        return '/'

      return (
        <div className="flex flex-col gap-1 items-start">
          <span>{formatTime(lastLogin, FormatOptions.YYYY_MM_DD_HH_mm_ss)}</span>
          <Tag className="select-none" color={getColorByDate(dayjs(lastLogin).valueOf())}>
            {timeAgo(dayjs(lastLogin).valueOf())}
          </Tag>
        </div>
      )
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

const fields: TField<UserFindAllRequest>[] = [{ type: 'input', name: 'username', label: '用户名' }]

export const CACHE_KEY_GET_USER_LIST = 'cacheKey-user-find-all'

export function useUserList({ filterHeight }: { filterHeight: number }) {
  const { data, loading, runAsync } = useRequest(fetchers.userFindAll, {
    cacheKey: CACHE_KEY_GET_USER_LIST,
  })
  const [form] = Form.useForm<TFieldFilter>()
  const dataSource = useMemo(() => data?.data.list ?? [], [data?.data.list])
  const pagination = useMemo<TablePaginationConfig>(
    () => ({
      showTotal: total => `共 ${total} 个`,
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
  const size = useSize(document.querySelector('html'))
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
