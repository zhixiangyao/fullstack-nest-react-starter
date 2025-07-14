import type { Blog } from '~/fetchers'
import { FileAddOutlined } from '@ant-design/icons'
import { useSize } from 'ahooks'
import { Button, Table } from 'antd'
import { useRef } from 'react'

import { Filter } from '~/components/Filter'

import { ButtonCopy } from './components/ButtonCopy'
import { ButtonDelete } from './components/ButtonDelete'
import { ButtonEdit } from './components/ButtonEdit'
import { ButtonView } from './components/ButtonView'
import { DrawerUpdate } from './components/DrawerUpdate'
import { useBlogList } from './hooks/useBlogList'
import { useDrawerUpdate } from './hooks/useDrawerUpdate'

function Blogs() {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  const drawerUpdate = useDrawerUpdate()
  const blogList = useBlogList({ filterHeight: size?.height ?? 0 })

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
        dataSource={blogList.dataSource}
        pagination={blogList.pagination}
        loading={blogList.loading}
        scroll={blogList.scroll}
        onChange={blogList.handleTableChange}
      >
        {blogList.columns.map(column => (
          <Table.Column<Blog>
            title={column.title}
            dataIndex={column.dataIndex}
            key={column.key}
            width={column.width}
            sorter={column.sorter}
            fixed={column.fixed}
            ellipsis={column.ellipsis}
            render={column.render}
          />
        ))}

        <Table.Column<Blog>
          title="Actions"
          key="actions"
          width={190}
          fixed="right"
          render={(_, record) => (
            <div className="flex items-center gap-2">
              <ButtonEdit record={record} handleOpenEdit={drawerUpdate.handleOpenEdit} />
              <ButtonCopy record={record} handleOpenCopy={drawerUpdate.handleOpenCopy} />
              <ButtonView record={record} handleOpenView={drawerUpdate.handleOpenView} />
              <ButtonDelete record={record} refresh={blogList.refresh} />
            </div>
          )}
        />
      </Table>

      <DrawerUpdate
        type={drawerUpdate.type}
        rules={drawerUpdate.rules}
        form={drawerUpdate.form}
        open={drawerUpdate.open}
        loading={drawerUpdate.loading}
        loadingConfirm={drawerUpdate.loadingConfirm}
        handleClose={drawerUpdate.handleClose}
        handleFinish={drawerUpdate.handleFinish}
        refresh={blogList.refresh}
      />
    </>
  )
}

export { Blogs }
