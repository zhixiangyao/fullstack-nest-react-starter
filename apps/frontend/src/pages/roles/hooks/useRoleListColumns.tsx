import type { ColumnsType } from 'antd/es/table'
import type { Role } from '~/fetchers'
import { Tag, Typography } from 'antd'
import { useMemo } from 'react'

import { TagRoleType } from '~/components/TagRoleType'

type TColumns = (ColumnsType<Role>[number] & { dataIndex?: keyof Role, key: keyof Role })[]

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 60,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    render(_, record) {
      return <TagRoleType value={record.name} />
    },
  },
  {
    title: 'Users',
    dataIndex: 'users',
    key: 'users',
    width: 300,
    render(_, record) {
      if (record.users.length === 0)
        return '/'

      return (
        <Typography.Paragraph ellipsis={{ tooltip: `a total of ${record.users.length}` }} className="!mb-0">
          {record.users.map(user => (
            <Tag key={user.uuid} className="select-none">
              {user.username}
            </Tag>
          ))}
        </Typography.Paragraph>
      )
    },
  },
] satisfies TColumns

function useRoleListColumns() {
  const columnsWidth = useMemo(
    () => columns.reduce((acc, cur) => acc + (typeof cur.width === 'number' ? cur.width : 200), 0),
    [],
  )

  return { columns, columnsWidth }
}

export { useRoleListColumns }
