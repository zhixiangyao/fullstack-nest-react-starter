import type { TablePaginationConfig } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TField } from '~/components/Filter'
import type { Role, UserFindAllRequest } from '~/fetchers'
import { useMemoizedFn, useRequest } from 'ahooks'
import { Form, Tag, Typography } from 'antd'
import { useMemo } from 'react'

import { TagRoleType } from '~/components/TagRoleType'
import * as fetchers from '~/fetchers'
import { useAppStore } from '~/stores/useAppStore'

type TFieldFilter = UserFindAllRequest

type TColumns = (ColumnsType<Role>[number] & { dataIndex?: keyof Role, key: keyof Role })[]

const fields: TField<UserFindAllRequest>[] = []

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 60,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    render(_, record) {
      return <TagRoleType value={record.name} />
    },
  },
  {
    title: 'Users',
    dataIndex: 'users',
    key: 'users',
    width: 300,
    render(_, record) {
      if (record.users.length === 0)
        return '/'

      return (
        <Typography.Paragraph ellipsis={{ tooltip: `a total of ${record.users.length}` }} className="!mb-0">
          {record.users.map(user => (
            <Tag key={user.uuid} className="select-none">
              {user.username}
            </Tag>
          ))}
        </Typography.Paragraph>
      )
    },
  },
] satisfies TColumns

interface Prams {
  filterHeight: number
}

function useRoleList({ filterHeight }: Prams) {
  const { data, loading, runAsync } = useRequest(fetchers.roleFindAll, { cacheKey: fetchers.roleFindAll.name })
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
    const y = (size?.height ?? 0) - 40 - 24 - filterHeight - 39 - 56

    return { x, y }
  }, [filterHeight, size?.height])

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
  }
}

export { useRoleList }
