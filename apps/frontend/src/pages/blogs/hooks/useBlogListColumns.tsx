import type { ColumnsType } from 'antd/es/table'
import type { Blog } from '~/fetchers'
import { Tag } from 'antd'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { FormatOptions, formatTime, getColorByDate, timeAgo } from 'utils'

import { ButtonEdit } from '../components/ButtonEdit'
import { SwitchPublished } from '../components/SwitchPublished'

type TColumns = (ColumnsType<Blog>[number] & { dataIndex?: keyof Blog, key: keyof Blog | 'actions' })[]

interface Prams {
  handleOpenEdit: (id: Blog['id']) => Promise<void>
  refresh: () => void
}

export function useBlogListColumns({ handleOpenEdit, refresh }: Prams) {
  const columns = useMemo(() => [
    {
      title: 'ID',
      dataIndex: 'id' satisfies keyof Blog,
      key: 'id',
      width: 100,
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
      title: 'Tags',
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
      title: 'Created At',
      dataIndex: 'createdAt' satisfies keyof Blog,
      key: 'createdAt',
      width: 260,
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
      width: 260,
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
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render(_, record) {
        return (
          <div className="flex items-center gap-2">
            <ButtonEdit record={record} handleOpenEdit={handleOpenEdit} />
          </div>
        )
      },
    },
  ] satisfies TColumns, [handleOpenEdit, refresh])
  const columnsWidth = useMemo(
    () => columns.reduce((acc, cur) => acc + (typeof cur.width === 'number' ? cur.width : 200), 0),
    [columns],
  )

  return { columns, columnsWidth }
}
