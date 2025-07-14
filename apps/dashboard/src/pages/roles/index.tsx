import type { Role } from '~/fetchers'
import { useSize } from 'ahooks'
import { Table } from 'antd'
import { useRef } from 'react'

import { Filter } from '~/components/Filter'

import { useRoleList } from './hooks/useRoleList'

function Roles() {
  const refFilter = useRef<HTMLDivElement>(null)
  const size = useSize(refFilter)
  const roleList = useRoleList({ filterHeight: size?.height ?? 0 })

  return (
    <>
      <Filter
        name="filter-roles"
        customRef={refFilter}
        loading={roleList.loading}
        form={roleList.form}
        fields={roleList.fields}
        handleFinish={roleList.handleFinish}
        handleReset={roleList.handleReset}
      />

      <Table<Role>
        size="small"
        rowKey={'id' satisfies keyof Role}
        columns={roleList.columns}
        dataSource={roleList.dataSource}
        pagination={roleList.pagination}
        loading={roleList.loading}
        scroll={roleList.scroll}
      />
    </>
  )
}

export { Roles }
