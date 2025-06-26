import type { TablePaginationConfig } from 'antd'
import type { TField } from '~/components/Filter'
import type { BlogFindAllRequest } from '~/fetchers'
import { useRequest } from 'ahooks'
import { Form } from 'antd'
import { useMemo } from 'react'

import * as fetchers from '~/fetchers'
import { useAppStore } from '~/stores/useAppStore'

type TFieldFilter = Omit<BlogFindAllRequest, 'published'> & { published?: 0 | 1 }

function genFilterParams(values: TFieldFilter): BlogFindAllRequest {
  return {
    ...values,
    published: values.published === 1 ? true : values.published === 0 ? false : void 0,
  }
}

const fields: TField<BlogFindAllRequest>[] = [
  {
    type: 'select',
    props: {
      options: [
        {
          label: 'Published',
          value: 1,
        },
        {
          label: 'Unpublished',
          value: 0,
        },
      ],
    },
    key: 'published',
    name: 'published',
    label: 'Published',
  },
]

interface Prams {
  filterHeight: number
  columnsWidth: number
}

export function useBlogList({ filterHeight, columnsWidth }: Prams) {
  const { data, loading, runAsync, refresh } = useRequest(fetchers.blogFindAll)
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
        const values = form.getFieldsValue()
        runAsync({ pageNo, pageSize, ...genFilterParams(values) })
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
    runAsync(genFilterParams(values))
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
