import type { TablePaginationConfig } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TField } from '~/components/Filter'
import type { User, UserFindAllRequest } from '~/fetchers'
import { useMemoizedFn, useRequest } from 'ahooks'
import { Avatar, Form, Tag } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { FormatOptions, formatTime, getColorByDate, timeAgo } from 'utils'

import { TagRoleType } from '~/components/TagRoleType'
import * as fetchers from '~/fetchers'
import { useAppStore } from '~/stores/useAppStore'

import { SwitchStatus } from '../components/SwitchStatus'

type TFieldFilter = UserFindAllRequest

type TColumns = (ColumnsType<User>[number] & { dataIndex?: keyof User, key: keyof User })[]

const fields: TField<UserFindAllRequest>[] = [{ type: 'input', key: 'username', name: 'username', label: 'Username' }]

interface Prams {
  filterHeight: number
}

function useUserList({ filterHeight }: Prams) {
  const { data, loading, runAsync, refresh } = useRequest(fetchers.userFindAll, { cacheKey: fetchers.userFindAll.name })
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
  const columns = useMemo(
    () =>
      [
        {
          title: 'Avatar',
          dataIndex: 'avatar',
          key: 'avatar',
          width: 65,
          fixed: 'left',
          render(_, record) {
            return <Avatar src={record.avatar ?? void 0}>{!record.avatar ? record.username : null}</Avatar>
          },
        },
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
          width: 100,
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
      ] satisfies TColumns,
    [refresh],
  )
  const scroll = useMemo(() => {
    const x = columns.reduce((acc, cur) => acc + (typeof cur.width === 'number' ? cur.width : 200), 0)
    const y = (size?.height ?? 0) - 40 - 24 - filterHeight - 39 - 56

    return { x, y }
  }, [columns, filterHeight, size?.height])

  const handleFinish = useMemoizedFn((values: TFieldFilter) => {
    runAsync(values)
  })

  const handleReset = useMemoizedFn(() => {
    form.resetFields()
    runAsync({})
  })

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
    refresh,
  }
}

export { useUserList }
