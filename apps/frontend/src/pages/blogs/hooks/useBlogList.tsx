import type { TablePaginationConfig } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TField } from '~/components/Filter'
import type { Blog, BlogFindAllRequest } from '~/fetchers'
import { useRequest } from 'ahooks'
import { Form, Tag } from 'antd'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { FormatOptions, formatTime, getColorByDate, timeAgo } from 'utils'

import * as fetchers from '~/fetchers'
import { useAppStore } from '~/stores/useAppStore'

import { SwitchPublished } from '../components/SwitchPublished'

type TFieldFilter = BlogFindAllRequest

const columns: ColumnsType<Blog> = [
  {
    title: '博客ID',
    dataIndex: 'id' satisfies keyof Blog,
    key: 'id',
    width: 100,
    fixed: 'left',
  },
  {
    title: '标题',
    dataIndex: 'title' satisfies keyof Blog,
    key: 'title',
    width: 150,
    ellipsis: true,
  },
  {
    title: '是否已发布',
    dataIndex: 'published' satisfies keyof Blog,
    key: 'published',
    width: 100,
    render(_, record) {
      return <SwitchPublished record={record} />
    },
  },
  {
    title: '阅读量',
    dataIndex: 'views' satisfies keyof Blog,
    key: 'views',
    width: 100,
  },
  {
    title: '标签',
    dataIndex: 'tags' satisfies keyof Blog,
    key: 'tags',
    width: 300,
    render(_, record) {
      if (record.tags.length === 0)
        return '/'

      return record.tags.map(tag => (
        <Tag key={tag} className="select-none">
          {tag}
        </Tag>
      ))
    },
  },
  {
    title: '创建于',
    dataIndex: 'createdAt' satisfies keyof Blog,
    key: 'createdAt',
    width: 260,
    render(_, { createdAt }) {
      return (
        <div className="flex gap-1 items-center">
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
    dataIndex: 'updatedAt' satisfies keyof Blog,
    key: 'updatedAt',
    width: 260,
    render(_, { updatedAt }) {
      return (
        <div className="flex gap-1 items-center">
          <span>{formatTime(updatedAt, FormatOptions.YYYY_MM_DD_HH_mm_ss)}</span>
          <Tag className="select-none" color={getColorByDate(dayjs(updatedAt).valueOf())}>
            {timeAgo(dayjs(updatedAt).valueOf())}
          </Tag>
        </div>
      )
    },
  },
]

const fields: TField<BlogFindAllRequest>[] = []

export const CACHE_KEY_BLOG_FIND_ALL = 'cacheKey-blog-find-all'

export function useBlogList({ filterHeight }: { filterHeight: number }) {
  const { data, loading, runAsync } = useRequest(fetchers.blogFindAll, {
    cacheKey: CACHE_KEY_BLOG_FIND_ALL,
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
