import type { Blog } from '~/fetchers'
import { Button } from 'antd'

interface Props {
  record: Blog
  handleOpenView: (id: Blog['id']) => Promise<void>
}

function ButtonView({ record, handleOpenView }: Props) {
  return (
    <Button type="link" className="!px-0" onClick={() => handleOpenView(record.id)}>
      View
    </Button>
  )
}

export { ButtonView }
