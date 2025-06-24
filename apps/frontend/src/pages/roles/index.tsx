import type { Role } from '~/fetchers'
import { useSize } from 'ahooks'
import { Table } from 'antd'
import React, { useRef } from 'react'

import { Filter } from '~/components/Filter'

import { useRoleList } from './hooks/useRoleList'
import { useRoleListColumns } from './hooks/useRoleListColumns'

function Roles() {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  const { columns, columnsWidth } = useRoleListColumns()
  const roleList = useRoleList({ filterHeight: size?.height ?? 0, columnsWidth })

  return (
    <>
      <Filter
        customRef={ref}
        loading={roleList.loading}
        form={roleList.form}
        fields={roleList.fields}
        handleFinish={roleList.handleFinish}
        handleReset={roleList.handleReset}
      />

      <Table<Role>
        size="small"
        rowKey={'id' satisfies keyof Role}
        columns={columns}
        dataSource={roleList.dataSource}
        pagination={roleList.pagination}
        loading={roleList.loading}
        scroll={roleList.scroll}
      />
    </>
  )
}

export { Roles }
