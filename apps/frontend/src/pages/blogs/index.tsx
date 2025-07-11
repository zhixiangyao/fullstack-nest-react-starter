import type { TreeDataNode } from 'antd'
import type { Blog } from '~/fetchers'
import { FileAddOutlined } from '@ant-design/icons'
import { useSize } from 'ahooks'
import { Button, Table, Tree } from 'antd'
import { useRef } from 'react'

import { Container } from '~/components/Container'
import { Filter } from '~/components/Filter'

import { DrawerUpdate } from './components/DrawerUpdate'
import { useBlogList } from './hooks/useBlogList'
import { useBlogListColumns } from './hooks/useBlogListColumns'
import { useDrawerUpdate } from './hooks/useDrawerUpdate'

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: 'leaf',
            key: '0-0-1-0',
          },
          {
            title: 'leaf',
            key: '0-0-1-1',
          },
        ],
      },
    ],
  },
]

function Blogs() {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  const drawerUpdate = useDrawerUpdate({ refresh })
  const { columns, columnsWidth } = useBlogListColumns({
    handleOpenView: drawerUpdate.handleOpenView,
    handleOpenEdit: drawerUpdate.handleOpenEdit,
    handleOpenCopy: drawerUpdate.handleOpenCopy,
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

      <div className="flex gap-2 w-full h-full">
        <Container className="w-[300px]">
          <Tree
            checkable
            virtual
            defaultExpandedKeys={['0-0-0', '0-0-1']}
            treeData={treeData}
            height={blogList.scroll.y}
          />
        </Container>

        <Container className="w-[calc(100%_-_308px)]">
          <Table<Blog>
            bordered
            size="small"
            rowKey={'id' satisfies keyof Blog}
            columns={columns}
            dataSource={blogList.dataSource}
            pagination={blogList.pagination}
            loading={blogList.loading}
            scroll={blogList.scroll}
            onChange={blogList.handleTableChange}
          />
        </Container>
      </div>

      <DrawerUpdate
        type={drawerUpdate.type}
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
