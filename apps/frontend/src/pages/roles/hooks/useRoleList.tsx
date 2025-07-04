import type { TablePaginationConfig } from 'antd'
import type { TField } from '~/components/Filter'
import type { UserFindAllRequest } from '~/fetchers'
import { useMemoizedFn, useRequest } from 'ahooks'
import { Form } from 'antd'
import { useMemo } from 'react'

import * as fetchers from '~/fetchers'
import { useAppStore } from '~/stores/useAppStore'

type TFieldFilter = UserFindAllRequest

const fields: TField<UserFindAllRequest>[] = []

interface Prams {
  filterHeight: number
  columnsWidth: number
}

function useRoleList({ filterHeight, columnsWidth }: Prams) {
  const { data, loading, runAsync } = useRequest(fetchers.roleFindAll)
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

    handleFinish,
    handleReset,
  }
}

export { useRoleList }
