import type { TablePaginationConfig } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TField } from '~/components/Filter'
import type { Role, UserFindAllRequest } from '~/fetchers'
import { useRequest } from 'ahooks'
import { Form, Tag, Typography } from 'antd'
import React, { useMemo } from 'react'

import { TagRoleType } from '~/components/TagRoleType'
import * as fetchers from '~/fetchers'
import { useAppStore } from '~/stores/useAppStore'

type TFieldFilter = UserFindAllRequest

const columns: ColumnsType<Role> = [
  {
    title: '角色ID',
    dataIndex: 'id' satisfies keyof Role,
    key: 'id',
    width: 100,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '角色名',
    dataIndex: 'name' satisfies keyof Role,
    key: 'name',
    width: 100,
    render(_, record) {
      return <TagRoleType value={record.name} />
    },
  },
  {
    title: '用户',
    dataIndex: 'users' satisfies keyof Role,
    key: 'users',
    width: 300,
    render(_, record) {
      if (record.users.length === 0)
        return '/'

      return (
        <Typography.Paragraph ellipsis={{ tooltip: `a total of ${record.users.length}` }} className="!mb-0">
          {record.users.map(user => (
            <Tag key={user.uuid}>{user.username}</Tag>
          ))}
        </Typography.Paragraph>
      )
    },
  },
]

const fields: TField<UserFindAllRequest>[] = []

export const CACHE_KEY_ROLE_FIND_ALL = 'cacheKey-role-find-all'

export function useRoleList({ filterHeight }: { filterHeight: number }) {
  const { data, loading, runAsync } = useRequest(fetchers.roleFindAll, {
    cacheKey: CACHE_KEY_ROLE_FIND_ALL,
  })
  const { size } = useAppStore()
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
