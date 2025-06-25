import type { TablePaginationConfig } from 'antd'
import type { TField } from '~/components/Filter'
import type { UserFindAllRequest } from '~/fetchers'
import { useRequest } from 'ahooks'
import { Form } from 'antd'
import { useMemo } from 'react'

import * as fetchers from '~/fetchers'
import { useAppStore } from '~/stores/useAppStore'

type TFieldFilter = UserFindAllRequest

const fields: TField<UserFindAllRequest>[] = [{ type: 'input', key: 'username0', name: 'username', label: 'Username' }]

interface Prams {
  filterHeight: number
  columnsWidth: number
}

export function useUserList({ filterHeight, columnsWidth }: Prams) {
  const { data, loading, runAsync, refresh } = useRequest(fetchers.userFindAll)
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
    const x = columnsWidth
    const y = (size?.height ?? 0) - 40 - 8 - filterHeight - 39 - 56

    return { x, y }
  }, [columnsWidth, filterHeight, size?.height])

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

    handleFinish,
    handleReset,
    refresh,
  }
}
