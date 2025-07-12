import type { Role } from '~/fetchers'
import { useSize } from 'ahooks'
import { Table } from 'antd'
import { useRef } from 'react'

import { Filter } from '~/components/Filter'

import { useRoleList } from './hooks/useRoleList'
import { useRoleListColumns } from './hooks/useRoleListColumns'

function Roles() {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  const roleListColumns = useRoleListColumns()
  const roleList = useRoleList({ filterHeight: size?.height ?? 0, columnsWidth: roleListColumns.columnsWidth })

  return (
    <>
      <Filter
        name="filter-roles"
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
        columns={roleListColumns.columns}
        dataSource={roleList.dataSource}
        pagination={roleList.pagination}
        loading={roleList.loading}
        scroll={roleList.scroll}
      />
    </>
  )
}

export { Roles }
