import type { Blog } from '~/fetchers'
import { FileAddOutlined } from '@ant-design/icons'
import { useSize } from 'ahooks'
import { Button, Table } from 'antd'
import { useRef } from 'react'

import { Filter } from '~/components/Filter'

import { DrawerUpdate } from './components/DrawerUpdate'
import { useBlogList } from './hooks/useBlogList'
import { useBlogListColumns } from './hooks/useBlogListColumns'
import { useDrawerUpdate } from './hooks/useDrawerUpdate'

function Blogs() {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  const drawerUpdate = useDrawerUpdate({ refresh })
  const { columns, columnsWidth } = useBlogListColumns({
    handleOpenEdit: drawerUpdate.handleOpenEdit,
    refresh,
  })
  const blogList = useBlogList({ filterHeight: size?.height ?? 0, columnsWidth })

  function refresh() {
    blogList.refresh()
  }

  return (
    <>
      <Filter
        name="filter-blogs"
        customRef={ref}
        loading={blogList.loading}
        form={blogList.form}
        fields={blogList.fields}
        handleFinish={blogList.handleFinish}
        handleReset={blogList.handleReset}
        extra={(
          <Button className="min-w-24" variant="filled" icon={<FileAddOutlined />} onClick={drawerUpdate.handleOpenAdd}>
            Add
          </Button>
        )}
      />

      <Table<Blog>
        size="small"
        rowKey={'id' satisfies keyof Blog}
        columns={columns}
        dataSource={blogList.dataSource}
        pagination={blogList.pagination}
        loading={blogList.loading}
        scroll={blogList.scroll}
        onChange={blogList.handleTableChange}
      />

      <DrawerUpdate
        rules={drawerUpdate.rules}
        form={drawerUpdate.form}
        open={drawerUpdate.open}
        loading={drawerUpdate.loading}
        loadingConfirm={drawerUpdate.loadingConfirm}
        handleClose={drawerUpdate.handleClose}
        handleFinish={drawerUpdate.handleFinish}
      />
    </>
  )
}

export { Blogs }
