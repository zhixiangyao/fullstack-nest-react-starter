import type { TablePaginationConfig, TableProps } from 'antd'
import type { SorterResult } from 'antd/es/table/interface'
import type { TField } from '~/components/Filter'
import type { Blog, BlogFindAllRequest } from '~/fetchers'
import { useMemoizedFn, useRequest } from 'ahooks'
import { Form } from 'antd'
import React, { useMemo, useRef } from 'react'

import * as fetchers from '~/fetchers'
import { useAppStore } from '~/stores/useAppStore'

import { SelectTags } from '../components/SelectTags'

type TFieldFilter = Omit<BlogFindAllRequest, 'published'> & { published?: 0 | 1 }

function genFilterParams(values: TFieldFilter, sorter?: SorterResult<Blog>): BlogFindAllRequest {
  return {
    ...values,
    published: values.published === 1 ? true : values.published === 0 ? false : void 0,
    tags: values.tags?.length ? values.tags : void 0,
    order: sorter?.order === 'ascend' ? 'asc' : 'desc',
    field: sorter?.field?.toString(),
  }
}

const fields: TField<BlogFindAllRequest>[] = [
  {
    type: 'input',
    key: 'title',
    name: 'title',
    label: 'Title',
  },
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
  {
    type: 'custom',
    key: 'tags',
    name: 'tags',
    label: 'Tags',
    component: <SelectTags />,
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
  const sorterRef = useRef<SorterResult<Blog>>()
  const pagination = useMemo<TablePaginationConfig>(
    () => ({
      showTotal: total => `A total of ${total} items`,
      current: data?.data.pageNo,
      total: data?.data.total,
      pageSize: data?.data.pageSize,
    }),
    [data?.data.pageNo, data?.data.pageSize, data?.data.total],
  )
  const scroll = useMemo(() => {
    const x = columnsWidth
    const y = (size?.height ?? 0) - 40 - 8 - filterHeight - 39 - 56

    return { x, y }
  }, [columnsWidth, filterHeight, size?.height])

  const handleFinish = useMemoizedFn((values: TFieldFilter) => {
    runAsync(genFilterParams(values, sorterRef.current))
  })

  const handleReset = useMemoizedFn(() => {
    form.resetFields()
    sorterRef.current = void 0
    runAsync({})
  })

  const handleTableChange = useMemoizedFn<NonNullable<TableProps<Blog>['onChange']>>((pagination, filters, sorter) => {
    if (!Array.isArray(sorter)) {
      sorterRef.current = sorter
    }

    const values = form.getFieldsValue()
    handleFinish({ ...values, pageNo: pagination.current, pageSize: pagination.pageSize })
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
    handleTableChange,
    refresh,
  }
}
