import type { Blog } from '~/fetchers'
import { Button } from 'antd'

interface Props {
  record: Blog
  handleOpenCopy: (id: Blog['id']) => Promise<void>
}

function ButtonCopy({ record, handleOpenCopy }: Props) {
  return (
    <Button type="link" className="!px-0" onClick={() => handleOpenCopy(record.id)}>
      Copy
    </Button>
  )
}

export { ButtonCopy }
