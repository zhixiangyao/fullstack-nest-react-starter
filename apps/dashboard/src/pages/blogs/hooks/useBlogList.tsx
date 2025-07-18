import type { TablePaginationConfig, TableProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { SorterResult } from 'antd/es/table/interface'
import type { TField } from '~/components/Filter'
import type { Blog, BlogFindAllRequest } from '~/fetchers'
import { useMemoizedFn, useRequest } from 'ahooks'
import { Form, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { useMemo, useRef } from 'react'
import { FormatOptions, formatTime, getColorByDate, timeAgo } from 'utils'

import * as fetchers from '~/fetchers'
import { useAppStore } from '~/stores/useAppStore'

import { SelectTags } from '../components/SelectTags'
import { SwitchPublished } from '../components/SwitchPublished'

type TFieldFilter = Omit<BlogFindAllRequest, 'published'> & { published?: 0 | 1 }

type TColumns = (ColumnsType<Blog>[number] & { dataIndex?: keyof Blog, key: keyof Blog })[]

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
}

function useBlogList(prams: Prams) {
  const { filterHeight } = prams
  const { data, loading, runAsync, refresh } = useRequest(fetchers.blogFindAll, { cacheKey: fetchers.blogFindAll.name })
  const { size } = useAppStore()
  const [form] = Form.useForm<TFieldFilter>()
  const dataSource = data?.data.list
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
  const columns = useMemo(
    () =>
      [
        {
          title: 'ID',
          dataIndex: 'id' satisfies keyof Blog,
          key: 'id',
          width: 60,
          fixed: 'left',
        },
        {
          title: 'Title',
          dataIndex: 'title' satisfies keyof Blog,
          key: 'title',
          width: 150,
          ellipsis: true,
        },
        {
          title: 'Published?',
          dataIndex: 'published' satisfies keyof Blog,
          key: 'published',
          width: 140,
          render(_, record) {
            return <SwitchPublished record={record} refresh={refresh} />
          },
        },
        {
          title: 'Views',
          dataIndex: 'views' satisfies keyof Blog,
          key: 'views',
          width: 100,
        },
        {
          title: 'Category',
          dataIndex: 'category' satisfies keyof Blog,
          key: 'category',
          width: 150,
          render(_, { category }) {
            if (!category)
              return '/'

            return <Tag className="select-none">{category}</Tag>
          },
        },
        {
          title: 'Tags',
          dataIndex: 'tags' satisfies keyof Blog,
          key: 'tags',
          width: 300,
          render(_, { tags }) {
            if (tags.length === 0)
              return '/'

            return (
              <Typography.Paragraph ellipsis={{ tooltip: `a total of ${tags.length}` }} className="!mb-0">
                {tags.map(tag => (
                  <Tag key={tag} className="select-none">
                    {tag}
                  </Tag>
                ))}
              </Typography.Paragraph>
            )
          },
        },
        {
          title: 'Created At',
          dataIndex: 'createdAt' satisfies keyof Blog,
          key: 'createdAt',
          width: 300,
          sorter: true,
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
          dataIndex: 'updatedAt' satisfies keyof Blog,
          key: 'updatedAt',
          width: 300,
          sorter: true,
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
      ] satisfies TColumns,
    [refresh],
  )
  const scroll = useMemo(() => {
    const x = columns.reduce((acc, cur) => acc + (typeof cur.width === 'number' ? cur.width : 200), 0)
    const y = (size?.height ?? 0) - 40 - 24 - filterHeight - 39 - 56

    return { x, y }
  }, [columns, filterHeight, size?.height])

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
    columns,

    handleFinish,
    handleReset,
    handleTableChange,
    refresh,
  }
}

export { useBlogList }
