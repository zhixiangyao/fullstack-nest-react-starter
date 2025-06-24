import type { Blog } from '~/fetchers'
import { useSize } from 'ahooks'
import { Table } from 'antd'
import React, { useRef } from 'react'

import { Filter } from '~/components/Filter'

import { useBlogList } from './hooks/useBlogList'
import { useBlogListColumns } from './hooks/useBlogListColumns'

function Blogs() {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  const { columns, columnsWidth } = useBlogListColumns()
  const blogList = useBlogList({ filterHeight: size?.height ?? 0, columnsWidth })

  return (
    <>
      <Filter
        customRef={ref}
        loading={blogList.loading}
        form={blogList.form}
        fields={blogList.fields}
        handleFinish={blogList.handleFinish}
        handleReset={blogList.handleReset}
      />

      <Table<Blog>
        size="small"
        rowKey={'id' satisfies keyof Blog}
        columns={columns}
        dataSource={blogList.dataSource}
        pagination={blogList.pagination}
        loading={blogList.loading}
        scroll={blogList.scroll}
      />
    </>
  )
}

export { Blogs }
